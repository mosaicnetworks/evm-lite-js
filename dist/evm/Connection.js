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
var fs = require("fs");
var JSONBig = require("json-bigint");
var solidityCompiler = require("solc");
var SolidityContract_1 = require("./classes/SolidityContract");
var Transaction_1 = require("./classes/Transaction");
var DefaultClient_1 = require("./client/DefaultClient");
var Connection = /** @class */ (function (_super) {
    __extends(Connection, _super);
    function Connection(host, port, defaultTXOptions) {
        var _this = _super.call(this, host, port) || this;
        _this.defaultTXOptions = defaultTXOptions;
        return _this;
    }
    Object.defineProperty(Connection.prototype, "defaultOptions", {
        get: function () {
            return this.defaultTXOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Connection.prototype, "defaultFrom", {
        get: function () {
            return this.defaultTXOptions.from;
        },
        set: function (address) {
            this.defaultTXOptions.from = address;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Connection.prototype, "defaultGas", {
        get: function () {
            return this.defaultTXOptions.gas;
        },
        set: function (gas) {
            this.defaultTXOptions.gas = gas;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Connection.prototype, "defaultGasPrice", {
        get: function () {
            return this.defaultTXOptions.gasPrice;
        },
        set: function (gasPrice) {
            this.defaultTXOptions.gasPrice = gasPrice;
        },
        enumerable: true,
        configurable: true
    });
    Connection.prototype.ContractFromSolidityFile = function (contractName, filePath) {
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
    Connection.prototype.ContractFromABI = function (abi) {
        return new SolidityContract_1.default({
            from: this.defaultTXOptions.from,
            jsonInterface: abi,
            gas: this.defaultTXOptions.gas,
            gasPrice: this.defaultTXOptions.gasPrice
        }, this.host, this.port);
    };
    Connection.prototype.prepareTransfer = function (to, value, from) {
        from = from || this.defaultFrom;
        return new Transaction_1.default({
            from: from,
            to: to,
            value: value,
            gas: this.defaultGas,
            gasPrice: this.defaultGasPrice
        }, this.host, this.port, false);
    };
    return Connection;
}(DefaultClient_1.default));
exports.default = Connection;
