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
var Accounts = /** @class */ (function (_super) {
    __extends(Accounts, _super);
    function Accounts(host, port) {
        return _super.call(this, host, port) || this;
    }
    Accounts.prototype.add = function () {
        // pass
    };
    Accounts.prototype.remove = function () {
        // pass
    };
    Accounts.prototype.clear = function () {
        // pass
    };
    Accounts.prototype.encrypt = function () {
        // pass
    };
    Accounts.prototype.decrypt = function () {
        // pass
    };
    return Accounts;
}(AccountClient_1.default));
