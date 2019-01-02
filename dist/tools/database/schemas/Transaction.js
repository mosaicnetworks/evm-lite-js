"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Transaction = /** @class */ (function () {
    function Transaction(sentTX) {
        this.data = {
            from: (sentTX && sentTX.from) || '',
            to: (sentTX && sentTX.to) || '',
            txHash: (sentTX && sentTX.txHash) || '',
            value: (sentTX && sentTX.value) || 0,
            gas: (sentTX && sentTX.gas) || 0,
            gasPrice: (sentTX && sentTX.gasPrice) || 0,
            nonce: (sentTX && sentTX.nonce) || 0,
            date: (sentTX && sentTX.date) || ''
        };
    }
    Object.defineProperty(Transaction.prototype, "raw", {
        get: function () {
            return this.data;
        },
        enumerable: true,
        configurable: true
    });
    Transaction.prototype.date = function (value) {
        this.data.date = value;
        return this;
    };
    Transaction.prototype.from = function (value) {
        this.data.from = value;
        return this;
    };
    Transaction.prototype.gas = function (value) {
        this.data.gas = value;
        return this;
    };
    Transaction.prototype.gasPrice = function (value) {
        this.data.gasPrice = value;
        return this;
    };
    Transaction.prototype.nonce = function (value) {
        this.data.nonce = value;
        return this;
    };
    Transaction.prototype.to = function (value) {
        this.data.to = value;
        return this;
    };
    Transaction.prototype.txHash = function (value) {
        this.data.txHash = value;
        return this;
    };
    Transaction.prototype.value = function (value) {
        this.data.value = value;
        return this;
    };
    return Transaction;
}());
exports.default = Transaction;
