"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var coder = require("web3/lib/solidity/coder");
// @ts-ignore
var SolFunction = require("web3/lib/web3/function");
var errors = require("../utils/errors");
var types_1 = require("../types");
var Transaction_1 = require("./Transaction");
var SolidityFunction = /** @class */ (function () {
    function SolidityFunction(abi, contractAddress, host, port) {
        this.contractAddress = contractAddress;
        this.host = host;
        this.port = port;
        this.name = abi.name;
        this.solFunction = new SolFunction('', abi, '');
        this.constant = (abi.stateMutability === "view" || abi.stateMutability === "pure" || abi.constant);
        this.payable = (abi.stateMutability === "payable" || abi.payable);
        this.inputTypes = abi.inputs.map(function (i) {
            return i.type;
        });
        this.outputTypes = abi.outputs && abi.outputs.map(function (i) {
            return i.type;
        }) || [];
    }
    SolidityFunction.prototype.generateTransaction = function (options) {
        var funcArgs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            funcArgs[_i - 1] = arguments[_i];
        }
        this._validateArgs(funcArgs);
        var callData = this.solFunction.getData();
        var tx = {
            from: options.from,
            to: this.contractAddress,
            gas: options.gas,
            gasPrice: options.gasPrice,
        };
        tx.data = callData;
        if (tx.value && tx.value <= 0 && this.payable) {
            throw Error('Function is payable and requires `value` greater than 0.');
        }
        else if (tx.value && tx.value > 0 && !this.payable) {
            throw Error('Function is not payable. Required `value` is 0.');
        }
        var unpackfn;
        if (this.constant) {
            unpackfn = this.unpackOutput.bind(this);
        }
        return new Transaction_1.default(tx, this.host, this.port, this.constant, unpackfn);
    };
    SolidityFunction.prototype.unpackOutput = function (output) {
        output = output.length >= 2 ? output.slice(2) : output;
        var result = coder.decodeParams(this.outputTypes, output);
        return result.length === 1 ? result[0] : result;
    };
    SolidityFunction.prototype._validateArgs = function (args) {
        this.requireArgsLength(args.length);
        this.requireSolidityTypes(args);
    };
    SolidityFunction.prototype.requireArgsLength = function (received) {
        var expected = this.inputTypes.length;
        if (expected !== received) {
            throw errors.InvalidNumberOfSolidityArgs(expected, received);
        }
        else {
            return true;
        }
    };
    ;
    SolidityFunction.prototype.requireSolidityTypes = function (args) {
        var _this = this;
        args.map(function (a, i) {
            if (types_1.parseSolidityTypes(typeof a) === _this.inputTypes[i]) {
                throw errors.InvalidSolidityType();
            }
        });
    };
    ;
    return SolidityFunction;
}());
exports.default = SolidityFunction;
