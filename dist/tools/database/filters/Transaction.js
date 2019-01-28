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
var Static_1 = require("../../classes/Static");
var Filter_1 = require("../abstract/Filter");
var Transactions = /** @class */ (function (_super) {
    __extends(Transactions, _super);
    function Transactions(transactions) {
        return _super.call(this, transactions) || this;
    }
    Transactions.prototype.sender = function (address) {
        return this.objects.filter(function (transaction) {
            return (Static_1.default.cleanAddress(transaction.from) ===
                Static_1.default.cleanAddress(address));
        });
    };
    Transactions.prototype.receiver = function (address) {
        return this.objects.filter(function (transaction) {
            return (Static_1.default.cleanAddress(transaction.to) ===
                Static_1.default.cleanAddress(address));
        });
    };
    return Transactions;
}(Filter_1.default));
exports.default = Transactions;
