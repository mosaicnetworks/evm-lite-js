"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var Accounts = require("web3-eth-accounts");
var types_1 = require("../types");
var Transaction_1 = require("./Transaction");
var Account = /** @class */ (function () {
    function Account(data) {
        this.balance = 0;
        this.nonce = 0;
        var randomHex = require('crypto-random-hex');
        if (!data) {
            this.account = new Accounts().create(randomHex(32));
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
        var account = new Accounts().decrypt(v3JSONKeyStore, password);
        return new Account(account);
    };
    Account.prototype.sign = function (message) {
        return this.account.sign(message);
    };
    Account.prototype.signTransaction = function (tx) {
        if (tx instanceof Transaction_1.default) {
            var transaction = tx.toJSON();
            if (!transaction.nonce) {
                tx.nonce(this.nonce);
            }
            if (!transaction.chainId) {
                tx.chainID(transaction.chainId || 1);
            }
            return this.account.signTransaction(
            // @ts-ignore
            types_1.parseTransaction(tx.toJSON()));
        }
        tx.nonce = tx.nonce || this.nonce;
        tx.chainId = tx.chainId || 1;
        return this.account.signTransaction(
        // @ts-ignore
        types_1.parseTransaction(tx.toJSON()));
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
