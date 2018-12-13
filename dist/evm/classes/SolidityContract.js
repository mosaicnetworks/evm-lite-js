"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var coder = require("web3/lib/solidity/coder.js");
var checks = require("../utils/checks");
var errors = require("../utils/errors");
var Transaction_1 = require("./Transaction");
var SolidityFunction_1 = require("./SolidityFunction");
var SolidityContract = /** @class */ (function () {
    function SolidityContract(options, host, port) {
        // const web3 = new Web3();
        // this.web3Contract = web3.eth.contract(this.options.jsonInterface).at(this.options.address);
        this.options = options;
        this.host = host;
        this.port = port;
        this.options.address = options.address;
        this.methods = {};
        if (this.options.address) {
            this.attachMethodsToContract();
        }
    }
    SolidityContract.prototype.deploy = function (options) {
        var _this = this;
        if (this.options.address) {
            throw errors.ContractAddressFieldSetAndDeployed();
        }
        this.options.jsonInterface.filter(function (abi) {
            if (abi.type === "constructor" && (options && options.parameters)) {
                checks.requireArgsLength(abi.inputs.length, options.parameters.length);
            }
        });
        if (options) {
            this.options.data = options.data || this.options.data;
            this.options.gas = options.gas || this.options.gas;
            this.options.gasPrice = options.gasPrice || this.options.gasPrice;
        }
        if (this.options.data) {
            var encodedData = this.options.data;
            if (options && options.parameters) {
                encodedData = encodedData + this.encodeConstructorParams(options.parameters);
            }
            return new Transaction_1.default({
                from: this.options.from,
                data: encodedData,
                gas: this.options.gas,
                gasPrice: this.options.gasPrice
            }, this.host, this.port, false)
                .gas(this.options.gas)
                .gasPrice(this.options.gasPrice)
                .send()
                .then(function (receipt) {
                _this.receipt = receipt;
                return _this.setAddressAndPopulate(_this.receipt.contractAddress);
            });
        }
        else {
            throw errors.InvalidDataFieldInOptions();
        }
    };
    SolidityContract.prototype.setAddressAndPopulate = function (address) {
        this.options.address = address;
        this.attachMethodsToContract();
        return this;
    };
    SolidityContract.prototype.address = function (address) {
        this.options.address = address;
        return this;
    };
    SolidityContract.prototype.gas = function (gas) {
        this.options.gas = gas;
        return this;
    };
    SolidityContract.prototype.gasPrice = function (gasPrice) {
        this.options.gasPrice = gasPrice;
        return this;
    };
    SolidityContract.prototype.data = function (data) {
        this.options.data = data;
        return this;
    };
    SolidityContract.prototype.JSONInterface = function (abis) {
        this.options.jsonInterface = abis;
        return this;
    };
    SolidityContract.prototype.attachMethodsToContract = function () {
        var _this = this;
        if (!this.options.address) {
            throw new Error('Cannot attach function');
        }
        this.options.jsonInterface.filter(function (json) {
            return json.type === 'function';
        })
            .map(function (funcJSON) {
            if (!_this.options.address) {
                throw new Error('Cannot attach function');
            }
            var solFunction = new SolidityFunction_1.default(funcJSON, _this.options.address, _this.host, _this.port);
            _this.methods[funcJSON.name] = solFunction.generateTransaction.bind(solFunction, {
                gas: _this.options.gas,
                gasPrice: _this.options.gasPrice,
                from: _this.options.from
            });
        });
    };
    SolidityContract.prototype.encodeConstructorParams = function (params) {
        return this.options.jsonInterface.filter(function (json) {
            return json.type === 'constructor' && json.inputs.length === params.length;
        })
            .map(function (json) {
            return json.inputs.map(function (input) {
                return input.type;
            });
        })
            .map(function (types) {
            return coder.encodeParams(types, params);
        })[0] || '';
    };
    return SolidityContract;
}());
exports.default = SolidityContract;
