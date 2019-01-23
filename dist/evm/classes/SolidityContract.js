"use strict";
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
var checks = require("../utils/checks");
var errors = require("../utils/errors");
var types_1 = require("../types");
var SolidityFunction_1 = require("./SolidityFunction");
var Transaction_1 = require("./Transaction");
var SolidityContract = /** @class */ (function () {
    function SolidityContract(options, host, port) {
        this.options = options;
        this.host = host;
        this.port = port;
        this.methods = {};
        if (this.options.address) {
            this.attachMethodsToContract();
        }
    }
    SolidityContract.prototype.deploy = function (account, params, options) {
        return __awaiter(this, void 0, void 0, function () {
            var data, transaction, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = __assign({}, options);
                        if (this.options.address) {
                            throw errors.ContractAddressFieldSetAndDeployed();
                        }
                        this.options.interface.filter(function (abi) {
                            if (abi.type === 'constructor' && (params)) {
                                checks.requireArgsLength(abi.inputs.length, params.length);
                            }
                        });
                        if (!(this.options.data || options.data)) return [3 /*break*/, 4];
                        data = options.data || this.options.data;
                        if (params) {
                            data = data + this.encodeConstructorParams(params);
                        }
                        transaction = new Transaction_1.default({
                            from: this.options.from,
                            data: data,
                            gas: options.gas || this.options.gas,
                            gasPrice: options.gasPrice || this.options.gasPrice,
                            nonce: this.options.nonce
                        }, this.host, this.port, false)
                            .gas(this.options.gas)
                            .gasPrice(this.options.gasPrice);
                        return [4 /*yield*/, transaction.sign(account)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, transaction.submit()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, transaction.receipt];
                    case 3:
                        receipt = _a.sent();
                        return [2 /*return*/, this.setAddressAndPopulateFunctions(receipt.contractAddress)];
                    case 4: throw errors.InvalidDataFieldInOptions();
                }
            });
        });
    };
    SolidityContract.prototype.setAddressAndPopulateFunctions = function (address) {
        this.address(address);
        this.attachMethodsToContract();
        return this;
    };
    SolidityContract.prototype.address = function (address) {
        this.options.address = new types_1.AddressType(address);
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
        this.options.interface = abis;
        return this;
    };
    SolidityContract.prototype.attachMethodsToContract = function () {
        var _this = this;
        if (!this.options.address) {
            throw new Error('Cannot attach functions. No contract address set.');
        }
        this.options.interface
            .filter(function (json) { return json.type === 'function'; })
            .map(function (funcABI) {
            if (!_this.options.address) {
                throw new Error('Cannot attach function');
            }
            var solFunction = new SolidityFunction_1.default(funcABI, _this.options.address, _this.host, _this.port);
            _this.methods[funcABI.name] = solFunction.generateTransaction.bind(solFunction, {
                gas: _this.options.gas,
                gasPrice: _this.options.gasPrice,
                from: _this.options.from
            });
        });
    };
    SolidityContract.prototype.encodeConstructorParams = function (params) {
        return this.options.interface.filter(function (json) {
            return json.type === 'constructor' && json.inputs.length === params.length;
        })
            .map(function (json) { return json.inputs.map(function (input) { return input.type; }); })
            .map(function (types) { return coder.encodeParams(types, params); })[0] || '';
    };
    return SolidityContract;
}());
exports.default = SolidityContract;
