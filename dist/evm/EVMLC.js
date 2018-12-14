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
var fs = require("fs");
var JSONBig = require("json-bigint");
var solidityCompiler = require("solc");
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
    EVMLC.prototype.generateContractFromSolidityFile = function (contractName, filePath) {
        var input = fs.readFileSync(filePath).toString();
        var output = solidityCompiler.compile(input, 1);
        var byteCode = output.contracts[":" + contractName].bytecode;
        var abi = JSONBig.parse(output.contracts[":" + contractName].interface);
        return new SolidityContract_1.default({
            from: this.defaultTXOptions.from,
            jsonInterface: abi,
            data: byteCode,
            gas: this.defaultTXOptions.gas,
            gasPrice: this.defaultTXOptions.gasPrice
        }, this.host, this.port);
    };
    ;
    EVMLC.prototype.generateContractFromABI = function (abi) {
        return new SolidityContract_1.default({
            from: this.defaultTXOptions.from,
            jsonInterface: abi,
            gas: this.defaultTXOptions.gas,
            gasPrice: this.defaultTXOptions.gasPrice
        }, this.host, this.port);
    };
    EVMLC.prototype.prepareTransfer = function (to, value, from) {
        from = from || this.defaultFrom;
        if (value <= 0) {
            throw new Error('A transfer of funds must have a value greater than 0.');
        }
        return new Transaction_1.default({
            from: new types_1.AddressType(from),
            to: new types_1.AddressType(to),
            value: value,
            gas: this.defaultGas,
            gasPrice: this.defaultGasPrice
        }, this.host, this.port, false);
    };
    return EVMLC;
}(DefaultClient_1.default));
exports.default = EVMLC;
