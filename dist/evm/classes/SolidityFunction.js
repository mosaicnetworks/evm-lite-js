"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var coder = require("web3/lib/solidity/coder.js");
// @ts-ignore
var SolFunction = require("web3/lib/web3/function.js");
var checks = require("../utils/checks");
var Transaction_1 = require("./Transaction");
var SolidityFunction = /** @class */ (function () {
    function SolidityFunction(abi, contractAddress, host, port) {
        this.contractAddress = contractAddress;
        this.host = host;
        this.port = port;
        this.name = abi.name;
        this._solFunction = new SolFunction('', abi, '');
        this._constant = (abi.stateMutability === "view" || abi.stateMutability === "pure" || abi.constant);
        this._payable = (abi.stateMutability === "payable" || abi.payable);
        this._inputTypes = abi.inputs.map(function (i) {
            return i.type;
        });
        this._outputTypes = abi.outputs && abi.outputs.map(function (i) {
            return i.type;
        }) || [];
    }
    SolidityFunction.prototype.generateTransaction = function (options) {
        var funcArgs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            funcArgs[_i - 1] = arguments[_i];
        }
        this._validateArgs(funcArgs);
        var callData = this._solFunction.getData();
        var tx = {
            from: options.from,
            to: this.contractAddress,
            gas: options.gas,
            gasPrice: options.gasPrice,
        };
        tx.data = callData;
        if (tx.value && tx.value <= 0 && this._payable) {
            throw Error('Function is payable and requires `value` greater than 0.');
        }
        else if (tx.value && tx.value > 0 && !this._payable) {
            throw Error('Function is not payable. Required `value` is 0.');
        }
        var unpackfn;
        if (this._constant) {
            unpackfn = this.unpackOutput.bind(this);
        }
        return new Transaction_1.default(tx, this.host, this.port, unpackfn);
    };
    SolidityFunction.prototype.unpackOutput = function (output) {
        output = output.length >= 2 ? output.slice(2) : output;
        var result = coder.decodeParams(this._outputTypes, output);
        return result.length === 1 ? result[0] : result;
    };
    SolidityFunction.prototype._validateArgs = function (args) {
        var _this = this;
        checks.requireArgsLength(this._inputTypes.length, args.length);
        args.map(function (a, i) {
            checks.requireSolidityTypes(_this._inputTypes[i], a);
        });
    };
    return SolidityFunction;
}());
exports.default = SolidityFunction;
