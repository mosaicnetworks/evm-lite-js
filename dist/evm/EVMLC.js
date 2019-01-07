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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var Transaction_1 = require("./classes/Transaction");
var SolidityContract_1 = require("./classes/SolidityContract");
var DefaultClient_1 = require("./client/DefaultClient");
var EVMLC = /** @class */ (function (_super) {
    __extends(EVMLC, _super);
    function EVMLC(host, port, userDefaultTXOptions) {
        var _this = _super.call(this, host, port) || this;
        _this.userDefaultTXOptions = userDefaultTXOptions;
        _this.defaultTXOptions = __assign({}, userDefaultTXOptions, { from: new types_1.AddressType(userDefaultTXOptions.from) });
        return _this;
    }
    Object.defineProperty(EVMLC.prototype, "defaultOptions", {
        get: function () {
            return this.userDefaultTXOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EVMLC.prototype, "defaultFrom", {
        get: function () {
            return this.defaultTXOptions.from.value;
        },
        set: function (address) {
            this.defaultTXOptions.from = new types_1.AddressType(address);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EVMLC.prototype, "defaultGas", {
        get: function () {
            return this.defaultTXOptions.gas;
        },
        set: function (gas) {
            this.defaultTXOptions.gas = gas;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EVMLC.prototype, "defaultGasPrice", {
        get: function () {
            return this.defaultTXOptions.gasPrice;
        },
        set: function (gasPrice) {
            this.defaultTXOptions.gasPrice = gasPrice;
        },
        enumerable: true,
        configurable: true
    });
    EVMLC.prototype.generateContractFromABI = function (abi, data) {
        var _this = this;
        this.requireAddress();
        return this.getAccount(this.defaultFrom.trim())
            .then(function (account) { return new SolidityContract_1.default({
            from: _this.defaultTXOptions.from,
            jsonInterface: abi,
            gas: _this.defaultTXOptions.gas,
            gasPrice: _this.defaultTXOptions.gasPrice,
            nonce: account.nonce,
            data: data || '',
        }, _this.host, _this.port); });
    };
    EVMLC.prototype.prepareTransfer = function (to, value, from) {
        var _this = this;
        var fromObject = new types_1.AddressType((from || this.defaultFrom).trim());
        if (!fromObject.value) {
            throw new Error('Default from address cannot be left blank or empty!');
        }
        if (!to) {
            throw new Error('Must provide a to address!');
        }
        if (value <= 0) {
            throw new Error('A transfer of funds must have a value greater than 0.');
        }
        return this.getAccount(fromObject.value)
            .then(function (account) { return new Transaction_1.default({
            from: fromObject,
            to: new types_1.AddressType(to.trim()),
            value: value,
            gas: _this.defaultGas,
            gasPrice: _this.defaultGasPrice,
            nonce: account.nonce,
            chainId: 1
        }, _this.host, _this.port, false); });
    };
    EVMLC.prototype.requireAddress = function () {
        if (!this.defaultTXOptions.from.value) {
            throw new Error('Default from address cannot be left blank or empty!');
        }
    };
    return EVMLC;
}(DefaultClient_1.default));
exports.default = EVMLC;
