"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Transaction = /** @class */ (function () {
    function Transaction(database) {
        this.database = database;
    }
    Transaction.prototype.add = function (tx) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.database.get('transactions').push(tx).write();
            resolve();
        });
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
