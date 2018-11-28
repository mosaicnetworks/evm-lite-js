"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Web3 = require("web3");
const coder = require("web3/lib/solidity/coder.js");
const checks = require("./utils/checks");
const errors = require("./utils/errors");
const SolidityFunction_1 = require("./SolidityFunction");
const Transaction_1 = require("./Transaction");
class SolidityContract {
    constructor(options, controller) {
        this.options = options;
        this.controller = controller;
        const web3 = new Web3();
        this.options.address = options.address || '';
        // this.web3Contract = web3.eth.contract(this.options.jsonInterface).at(this.options.address);
        this.receipt = undefined;
        this.methods = {};
        if (this.options.address !== undefined) {
            this._attachMethodsToContract();
        }
    }
    deploy(options) {
        if (this.options.address !== '') {
            throw errors.ContractAddressFieldSetAndDeployed();
        }
        this.options.jsonInterface.filter((abi) => {
            if (abi.type === "constructor" && options.parameters) {
                checks.requireArgsLength(abi.inputs.length, options.parameters.length);
            }
        });
        if (options) {
            this.options.data = options.data || this.options.data;
            this.options.gas = options.gas || this.options.gas;
            this.options.gasPrice = options.gasPrice || this.options.gasPrice;
        }
        if (this.options.data) {
            let encodedData;
            if (options.parameters) {
                encodedData = this.options.data + this._encodeConstructorParams(options.parameters);
            }
            return new Transaction_1.default({
                from: this.controller.defaultOptions.from,
                data: encodedData
            }, false, undefined, this.controller)
                .gas(this.options.gas)
                .gasPrice(this.options.gasPrice)
                .send().then((receipt) => {
                this.receipt = receipt;
                return this.setAddressAndPopulate(this.receipt.contractAddress);
            });
        }
        else {
            throw errors.InvalidDataFieldInOptions();
        }
    }
    setAddressAndPopulate(address) {
        this.options.address = address;
        this._attachMethodsToContract();
        return this;
    }
    address(address) {
        this.options.address = address;
        return this;
    }
    gas(gas) {
        this.options.gas = gas;
        return this;
    }
    gasPrice(gasPrice) {
        this.options.gasPrice = gasPrice;
        return this;
    }
    data(data) {
        this.options.data = data;
        return this;
    }
    JSONInterface(abis) {
        this.options.jsonInterface = abis;
        return this;
    }
    _attachMethodsToContract() {
        this.options.jsonInterface.filter((json) => {
            return json.type === 'function';
        })
            .map((funcJSON) => {
            const solFunction = new SolidityFunction_1.default(funcJSON, this.options.address, this.controller);
            if (this.options.gas !== undefined && this.options.gasPrice !== undefined) {
                this.methods[funcJSON.name] = solFunction.generateTransaction.bind(solFunction, {
                    gas: this.options.gas,
                    gasPrice: this.options.gasPrice,
                });
            }
            else {
                this.methods[funcJSON.name] = solFunction.generateTransaction.bind(solFunction, {});
            }
        });
    }
    _encodeConstructorParams(params) {
        return this.options.jsonInterface.filter((json) => {
            return json.type === 'constructor' && json.inputs.length === params.length;
        })
            .map((json) => {
            return json.inputs.map((input) => {
                return input.type;
            });
        })
            .map((types) => {
            return coder.encodeParams(types, params);
        })[0] || '';
    }
}
exports.default = SolidityContract;
