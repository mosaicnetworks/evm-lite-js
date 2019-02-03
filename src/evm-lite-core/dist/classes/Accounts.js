"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var web3_eth_accounts_1 = require("web3-eth-accounts");
var Account_1 = require("./Account");
var Accounts = /** @class */ (function () {
    function Accounts() {
        this.accounts = new web3_eth_accounts_1.Accounts('http://', {
            defaultAccount: '0X0000000000000000000000000000000000000000',
            defaultGas: 0,
            defaultGasPrice: ''
        });
    }
    Accounts.prototype.decrypt = function (v3JSONKeyStore, password) {
        var account = this.accounts.decrypt(v3JSONKeyStore, password);
        return new Account_1.default(account);
    };
    Accounts.prototype.create = function () {
        var randomHex = require('crypto-random-hex');
        return new Account_1.default(this.accounts.create(randomHex(32)));
    };
    return Accounts;
}());
exports.default = Accounts;
