"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Wallet = require("web3-eth-accounts");
var types_1 = require("../types");
var Transaction_1 = require("./Transaction");
var Account = /** @class */ (function () {
    function Account(data) {
        this.balance = 0;
        this.nonce = 0;
        if (!data) {
            // @ts-ignore
            this.account = new Wallet().create();
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
        var decryptedAccount = new Wallet().decrypt(v3JSONKeyStore, password);
        return new Account(decryptedAccount);
    };
    Account.prototype.sign = function (message) {
        return this.account.sign(message);
    };
    Account.prototype.signTransaction = function (tx) {
        if (tx instanceof Transaction_1.default) {
            tx.tx.nonce = tx.tx.nonce || this.nonce;
            tx.tx.chainId = tx.tx.chainId || 1;
            return this.account.signTransaction(types_1.parseTransaction(tx.tx));
        }
        tx.nonce = tx.nonce || this.nonce;
        tx.chainId = tx.chainId || 1;
        return this.account.signTransaction(types_1.parseTransaction(tx));
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
