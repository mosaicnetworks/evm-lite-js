"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Transactions = /** @class */ (function () {
    function Transactions(dbPath, transactions) {
        this.dbPath = dbPath;
        this.transactions = transactions;
        this.sort();
    }
    Transactions.prototype.all = function () {
        return this.transactions;
    };
    Transactions.prototype.add = function (tx) {
        delete tx.chainId;
        delete tx.data;
        tx.value = parseInt(tx.value, 16);
        tx.gas = parseInt(tx.gas, 16);
        tx.gasPrice = parseInt(tx.gasPrice, 16);
        tx.nonce = parseInt(tx.nonce, 16);
        tx.date = new Date();
        this.transactions.push(tx);
        this.sort();
    };
    Transactions.prototype.get = function (hash) {
        if (!hash.startsWith('0x')) {
            hash = "0x" + hash;
        }
        return this.transactions.filter(function (tx) {
            return hash === tx.txHash;
        })[0] || null;
    };
    Transactions.prototype.sort = function () {
        this.transactions.sort(function (a, b) {
            // @ts-ignore
            return new Date(b.date) - new Date(a.date);
        });
    };
    return Transactions;
}());
exports.default = Transactions;
