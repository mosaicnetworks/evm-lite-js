"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Accounts = require("web3-eth-accounts");
var Account = /** @class */ (function () {
    function Account(data) {
        this.balance = 0;
        this.nonce = 0;
        if (!data) {
            // @ts-ignore
            this.account = new Accounts().create();
        }
        else {
            this.account = data;
        }
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
    Account.decrypt = function (v3JSONKeyStore, password) {
        // @ts-ignore
        var decryptedAccount = new Accounts().decrypt(v3JSONKeyStore, password);
        return new Account(decryptedAccount);
    };
    Account.prototype.sign = function (message) {
        return this.account.sign(message);
    };
    Account.prototype.signTransaction = function (tx) {
        return this.account.signTransaction(tx);
    };
    Account.prototype.encrypt = function (password) {
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
