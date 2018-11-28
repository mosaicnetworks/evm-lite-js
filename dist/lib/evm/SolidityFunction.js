"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coder = require("web3/lib/solidity/coder.js");
const SolFunction = require("web3/lib/web3/function.js");
const checks = require("./utils/checks");
const Transaction_1 = require("./Transaction");
class SolidityFunction {
    constructor(abi, contractAddress, controller) {
        this.contractAddress = contractAddress;
        this.controller = controller;
        this.name = abi.name;
        this._solFunction = new SolFunction('', abi, '');
        this._constant = (abi.stateMutability === "view" || abi.stateMutability === "pure" || abi.constant);
        this._payable = (abi.stateMutability === "payable" || abi.payable);
        this._inputTypes = abi.inputs.map((i) => {
            return i.type;
        });
        this._outputTypes = abi.outputs.map((i) => {
            return i.type;
        });
    }
    generateTransaction(options, ...funcArgs) {
        this._validateArgs(funcArgs);
        const callData = this._solFunction.getData();
        const tx = {
            from: this.controller.defaultOptions.from,
            to: this.contractAddress,
        };
        if (options && options.gas !== undefined && options.gasPrice !== undefined) {
            tx.gas = options.gas;
            tx.gasPrice = options.gasPrice;
        }
        tx.data = callData;
        if (tx.value <= 0 && this._payable) {
            throw Error('Function is payable and requires `value` greater than 0.');
        }
        else if (tx.value > 0 && !this._payable) {
            throw Error('Function is not payable. Required `value` is 0.');
        }
        let unpackfn;
        if (this._constant) {
            unpackfn = this.unpackOutput.bind(this);
        }
        return new Transaction_1.default(tx, this._constant, unpackfn, this.controller);
    }
    unpackOutput(output) {
        output = output.length >= 2 ? output.slice(2) : output;
        const result = coder.decodeParams(this._outputTypes, output);
        return result.length === 1 ? result[0] : result;
    }
    _validateArgs(args) {
        checks.requireArgsLength(this._inputTypes.length, args.length);
        args.map((a, i) => {
            checks.requireSolidityTypes(this._inputTypes[i], a);
        });
    }
}
exports.default = SolidityFunction;
