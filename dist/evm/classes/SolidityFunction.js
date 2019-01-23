"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var coder = require("web3/lib/solidity/coder");
// @ts-ignore
var SolFunction = require("web3/lib/web3/function");
var errors = require("../utils/errors");
var types_1 = require("../types");
var AccountClient_1 = require("../client/AccountClient");
var Transaction_1 = require("./Transaction");
var SolidityFunction = /** @class */ (function (_super) {
    __extends(SolidityFunction, _super);
    function SolidityFunction(abi, contractAddress, host, port) {
        var _this = _super.call(this, host, port) || this;
        _this.contractAddress = contractAddress;
        _this.name = abi.name;
        _this.solFunction = new SolFunction('', abi, '');
        _this.constant = (abi.stateMutability === 'view' || abi.stateMutability === 'pure' || abi.constant);
        _this.payable = (abi.stateMutability === 'payable' || abi.payable);
        _this.inputTypes = abi.inputs.map(function (i) {
            return i.type;
        });
        _this.outputTypes = abi.outputs && abi.outputs.map(function (i) {
            return i.type;
        }) || [];
        return _this;
    }
    SolidityFunction.prototype.generateTransaction = function (options) {
        var funcArgs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            funcArgs[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var callData, tx, unpackfn, account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.validateArgs(funcArgs);
                        callData = this.solFunction.getData();
                        tx = {
                            from: options.from,
                            to: this.contractAddress,
                            gas: options.gas,
                            gasPrice: options.gasPrice
                        };
                        tx.data = callData;
                        if (tx.value && tx.value <= 0 && this.payable) {
                            throw Error('Function is payable and requires `value` greater than 0.');
                        }
                        else if (tx.value && tx.value > 0 && !this.payable) {
                            throw Error('Function is not payable. Required `value` is 0.');
                        }
                        if (this.constant) {
                            unpackfn = this.unpackOutput.bind(this);
                        }
                        return [4 /*yield*/, this.getAccount(tx.from.value)];
                    case 1:
                        account = _a.sent();
                        return [2 /*return*/, new Transaction_1.default(__assign({}, tx, { nonce: account.nonce }), this.host, this.port, this.constant, unpackfn)];
                }
            });
        });
    };
    SolidityFunction.prototype.unpackOutput = function (output) {
        var result = coder.decodeParams(this.outputTypes, output.length >= 2 ? output.slice(2) : output);
        return result.length === 1 ? result[0] : result;
    };
    SolidityFunction.prototype.validateArgs = function (args) {
        this.requireArgsLength(args.length);
        this.requireSolidityTypes(args);
    };
    SolidityFunction.prototype.requireArgsLength = function (received) {
        var expected = this.inputTypes.length;
        if (expected !== received) {
            throw errors.InvalidNumberOfSolidityArgs(expected, received);
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
}(AccountClient_1.default));
exports.default = SolidityFunction;
