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
var JSONBig = require("json-bigint");
var types_1 = require("../types");
var TransactionClient_1 = require("../client/TransactionClient");
function delay(t, v) {
    return new Promise(function (resolve) {
        setTimeout(resolve.bind(null, v), t);
    });
}
var Transaction = /** @class */ (function (_super) {
    __extends(Transaction, _super);
    function Transaction(tx, host, port, constant, unpackfn) {
        var _this = _super.call(this, host, port) || this;
        _this.tx = tx;
        _this.constant = constant;
        _this.unpackfn = unpackfn;
        return _this;
    }
    Object.defineProperty(Transaction.prototype, "receipt", {
        get: function () {
            if (this.hash) {
                return this.getReceipt(this.hash);
            }
            else {
                throw new Error('Transaction hash not found');
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Send a transaction to a node for a controlled account.
     *
     * @param options - Override transactions options
     *
     * @deprecated
     */
    Transaction.prototype.send = function (options) {
        var _this = this;
        this.assignTXValues(options);
        if (this.constant) {
            throw new Error('Transaction does not mutate state. Use `call()` instead');
        }
        if (!this.tx.data && !this.tx.value) {
            throw new Error('Transaction does have a value to send.');
        }
        return this.sendTX(this.parseToString())
            .then(function (response) { return response.txHash; })
            .then(function (txHash) { return _this.getReceipt(txHash); })
            .then(function (response) {
            _this.txReceipt = response;
            return _this.txReceipt;
        });
    };
    /**
     * Should `send()` or `call()` the transaction or message dependent on
     * whether the transaction or message mutates the state.
     *
     * @param options - (optional) Override transaction options.
     * @param account - (optional) The account to sign this transaction.
     */
    Transaction.prototype.submit = function (options, account) {
        return __awaiter(this, void 0, void 0, function () {
            var txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.assignTXValues(options);
                        if (!this.tx.gas || (!this.tx.gasPrice && this.tx.gasPrice !== 0)) {
                            throw new Error('Gas or Gas Price not set');
                        }
                        if (!this.tx.data && !this.tx.value) {
                            throw new Error('Transaction does have a value to send.');
                        }
                        if (!!this.constant) return [3 /*break*/, 5];
                        if (!account) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sign(account)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.signedTX) {
                            throw new Error('Transaction has not been signed locally yet.');
                        }
                        return [4 /*yield*/, this.sendRaw(this.signedTX.rawTransaction)];
                    case 3:
                        txHash = (_a.sent()).txHash;
                        return [4 /*yield*/, delay(1000)];
                    case 4:
                        _a.sent();
                        this.hash = txHash;
                        return [2 /*return*/, this];
                    case 5: return [4 /*yield*/, delay(1000)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.call()];
                    case 7: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Transaction.prototype.sign = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, account.signTransaction(this.parseTransaction())];
                    case 1:
                        _a.signedTX = _b.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    Transaction.prototype.call = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var tx, call, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.constant) {
                            throw new Error('Transaction mutates state. Use `send()` instead');
                        }
                        if (this.tx.value) {
                            throw new Error('Transaction cannot have value if it' +
                                'does not intend to mutate the state.');
                        }
                        tx = JSON.parse(this.parseToString());
                        delete tx.chainId;
                        delete tx.nonce;
                        return [4 /*yield*/, this.callTX(JSON.stringify(tx))];
                    case 1:
                        call = _a.sent();
                        response = JSONBig.parse(call);
                        if (!this.unpackfn) {
                            throw new Error('Unpacking function required.');
                        }
                        return [2 /*return*/, this.unpackfn(Buffer.from(response.data).toString())];
                }
            });
        });
    };
    Transaction.prototype.parseToString = function () {
        return JSONBig.stringify(this.parseTransaction());
    };
    Transaction.prototype.from = function (from) {
        this.tx.from = new types_1.AddressType(from);
        return this;
    };
    Transaction.prototype.nonce = function (nonce) {
        this.tx.nonce = nonce;
        return this;
    };
    Transaction.prototype.chainID = function (chainId) {
        this.tx.chainId = chainId;
        return this;
    };
    Transaction.prototype.to = function (to) {
        this.tx.to = new types_1.AddressType(to);
        return this;
    };
    Transaction.prototype.value = function (value) {
        this.tx.value = value;
        return this;
    };
    Transaction.prototype.gas = function (gas) {
        this.tx.gas = gas;
        return this;
    };
    Transaction.prototype.gasPrice = function (gasPrice) {
        this.tx.gasPrice = gasPrice;
        return this;
    };
    Transaction.prototype.data = function (data) {
        this.tx.data = data;
        return this;
    };
    Transaction.prototype.parseTransaction = function () {
        var data = this.tx.data;
        var parsedTX = __assign({}, this.tx, { from: this.tx.from.value.toLowerCase(), to: (this.tx.to && this.tx.to.value.toLowerCase()) || '', value: this.tx.value || 0 });
        if (data) {
            if (!data.startsWith('0x')) {
                data = '0x' + data;
            }
            parsedTX.data = data;
        }
        return parsedTX;
    };
    Transaction.prototype.assignTXValues = function (options) {
        if (options) {
            this.tx.to = options.to ? new types_1.AddressType(options.to) : this.tx.to;
            this.tx.from = options.from
                ? new types_1.AddressType(options.from)
                : this.tx.from;
            this.tx.gas = options.gas || this.tx.gas;
            this.tx.value = options.value || this.tx.value;
            this.tx.gasPrice = options.gasPrice || this.tx.gasPrice;
        }
    };
    return Transaction;
}(TransactionClient_1.default));
exports.default = Transaction;
