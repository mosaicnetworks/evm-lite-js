"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var JSONBig = require("json-bigint");
var BaseClient_1 = require("./BaseClient");
var TransactionClient_1 = require("./TransactionClient");
var DefaultClient = /** @class */ (function (_super) {
    __extends(DefaultClient, _super);
    function DefaultClient(host, port) {
        return _super.call(this, host, port) || this;
    }
    DefaultClient.prototype.getAccount = function (address) {
        return BaseClient_1.request(this.options('GET', "/account/" + address))
            .then(function (response) {
            var account = JSONBig.parse(response);
            if (typeof account.balance === 'object') {
                account.balance = account.balance.toFormat(0);
            }
            return account;
        })
            .catch(function () { return null; });
    };
    DefaultClient.prototype.testConnection = function () {
        return BaseClient_1.request(this.options('GET', '/info'))
            .then(function () { return true; })
            .catch(function () { return null; });
    };
    DefaultClient.prototype.getAccounts = function () {
        return BaseClient_1.request(this.options('GET', '/accounts'))
            .then(function (response) {
            var json = JSONBig.parse(response);
            if (json.accounts) {
                return json.accounts.map(function (account) {
                    if (typeof account.balance === 'object') {
                        account.balance = account.balance.toFormat(0);
                    }
                    return account;
                });
            }
            else {
                return [];
            }
        })
            .catch(function () { return null; });
    };
    DefaultClient.prototype.getInfo = function () {
        return BaseClient_1.request(this.options('GET', '/info'))
            .then(function (response) { return JSONBig.parse(response); })
            .catch(function () { return null; });
    };
    return DefaultClient;
}(TransactionClient_1.default));
exports.default = DefaultClient;
