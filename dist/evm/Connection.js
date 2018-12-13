"use strict";
// import * as fs from 'fs';
// import * as JSONBig from 'json-bigint'
// import * as solidityCompiler from 'solc'
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
// import SolidityContract from "./classes/SolidityContract";
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
    // public ContractFromSolidityFile(contractName: string, filePath: string): SolidityContract {
    //     const input = fs.readFileSync(filePath).toString();
    //     const output = solidityCompiler.compile(input, 1);
    //     const byteCode = output.contracts[`:${contractName}`].bytecode;
    //     const abi = JSONBig.parse<ABI[]>(output.contracts[`:${contractName}`].interface);
    //
    //     return new SolidityContract({
    //         from: this.defaultTXOptions.from,
    //         jsonInterface: abi,
    //         data: byteCode,
    //         gas: this.defaultTXOptions.gas,
    //         gasPrice: this.defaultTXOptions.gasPrice
    //     }, this.host, this.port)
    // };
    //
    // public ContractFromABI(abi: ABI[]): SolidityContract {
    //     return new SolidityContract({
    //         from: this.defaultTXOptions.from,
    //         jsonInterface: abi,
    //         gas: this.defaultTXOptions.gas,
    //         gasPrice: this.defaultTXOptions.gasPrice
    //     }, this.host, this.port);
    // }
    Connection.prototype.prepareTransfer = function (to, value, from) {
        from = from || this.defaultFrom;
        return new Transaction_1.default({
            from: from,
            to: to,
            value: value,
            gas: this.defaultGas,
            gasPrice: this.defaultGasPrice
        }, this.host, this.port);
    };
    return Connection;
}(DefaultClient_1.default));
exports.default = Connection;
