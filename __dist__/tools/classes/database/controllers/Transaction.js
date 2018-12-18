"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Transaction_1 = require("../schemas/Transaction");
var Transaction = /** @class */ (function () {
    function Transaction(database) {
        this.database = database;
        this.schema = Transaction_1.default;
    }
    Transaction.prototype.add = function (tx) {
        var _this = this;
        return new Promise(function (resolve) {
            var txToSubmit = (tx instanceof Transaction_1.default) ? tx.raw : tx;
            _this.database.get('transactions').push(txToSubmit).write();
            resolve();
        });
    };
    Transaction.prototype.create = function (tx) {
        return new this.schema(tx);
    };
    Transaction.prototype.list = function () {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(_this.database.getState().transactions);
        });
    };
    Transaction.prototype.get = function (hash) {
        var _this = this;
        return new Promise(function (resolve) {
            var transaction = _this.database.get('transactions')
                .find({
                txHash: hash
            })
                .value();
            resolve(transaction);
        });
    };
    return Transaction;
}());
exports.default = Transaction;
