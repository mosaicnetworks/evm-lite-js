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
var AccountClient_1 = require("../client/AccountClient");
var Wallet = /** @class */ (function (_super) {
    __extends(Wallet, _super);
    function Wallet(host, port) {
        return _super.call(this, host, port) || this;
    }
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
    Wallet.prototype.decrypt = function () {
        // pass
    };
    return Wallet;
}(AccountClient_1.default));
