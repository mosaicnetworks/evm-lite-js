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
var JSONBig = require("json-bigint");
var BaseClient_1 = require("./BaseClient");
var TransactionClient = /** @class */ (function (_super) {
    __extends(TransactionClient, _super);
    function TransactionClient(host, port) {
        return _super.call(this, host, port) || this;
    }
    TransactionClient.prototype.callTX = function (tx) {
        return BaseClient_1.request(this.options('POST', '/call'), tx);
    };
    TransactionClient.prototype.sendTX = function (tx) {
        return BaseClient_1.request(this.options('POST', '/tx'), tx).then(function (response) {
            return JSON.parse(response);
        });
    };
    TransactionClient.prototype.sendRaw = function (tx) {
        return BaseClient_1.request(this.options('POST', '/rawtx'), tx).then(function (response) {
            return JSONBig.parse(response);
        });
    };
    TransactionClient.prototype.getReceipt = function (txHash) {
        return BaseClient_1.request(this.options('GET', "/tx/" + txHash)).then(function (response) { return JSONBig.parse(response); });
    };
    return TransactionClient;
}(BaseClient_1.default));
exports.default = TransactionClient;
