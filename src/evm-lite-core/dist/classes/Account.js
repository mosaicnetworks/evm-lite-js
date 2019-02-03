"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Account = /** @class */ (function () {
    function Account(data) {
        this.balance = 0;
        this.nonce = 0;
        this.account = data;
    }
    Object.defineProperty(Account.prototype, "address", {
        get: function () {
            return this.account.address;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Account.prototype, "privateKey", {
        get: function () {
            return this.account.privateKey;
        },
        enumerable: true,
        configurable: true
    });
    Account.prototype.sign = function (message) {
        return this.account.sign(message);
    };
    Account.prototype.signTransaction = function (tx) {
        tx.nonce = tx.nonce || this.nonce;
        tx.chainId = tx.chainId || 1;
        // @ts-ignore
        return this.account.signTransaction(tx);
    };
    Account.prototype.encrypt = function (password) {
        // @ts-ignore
        return this.account.encrypt(password);
    };
    Account.prototype.toBaseAccount = function () {
        return {
            address: this.address,
            balance: this.balance,
            nonce: this.nonce
        };
    };
    return Account;
}());
exports.default = Account;
