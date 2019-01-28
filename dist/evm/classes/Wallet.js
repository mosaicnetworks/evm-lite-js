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
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var Accounts = require("web3-eth-accounts");
var AccountClient_1 = require("../client/AccountClient");
var Account_1 = require("./Account");
var Wallet = /** @class */ (function (_super) {
    __extends(Wallet, _super);
    function Wallet(host, port) {
        return _super.call(this, host, port) || this;
    }
    Wallet.decrypt = function (v3JSONKeyStore, password) {
        var account = new Accounts().decrypt(v3JSONKeyStore, password);
        return new Account_1.default(account);
    };
    Wallet.prototype.add = function () {
        // pass
    };
    Wallet.prototype.remove = function () {
        // pass
    };
    Wallet.prototype.clear = function () {
        // pass
    };
    Wallet.prototype.encrypt = function () {
        // pass
    };
    return Wallet;
}(AccountClient_1.default));
exports.default = Wallet;
