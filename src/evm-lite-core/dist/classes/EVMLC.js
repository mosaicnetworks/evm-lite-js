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
var types_1 = require("../types");
var Transaction_1 = require("./Transaction");
var SolidityContract_1 = require("./SolidityContract");
var Accounts_1 = require("../classes/Accounts");
var DefaultClient_1 = require("../client/DefaultClient");
var EVMLC = /** @class */ (function (_super) {
    __extends(EVMLC, _super);
    /**
     * The root controller class to interact with contracts and make transfers.
     *
     * @param host - The host address of the node.
     * @param port - The port of the node.
     * @param userDefaultTXOptions - The default values for transactions.
     */
    function EVMLC(host, port, userDefaultTXOptions) {
        var _this = _super.call(this, host, port) || this;
        _this.userDefaultTXOptions = userDefaultTXOptions;
        _this.accounts = new Accounts_1.default();
        _this.defaultTXOptions = __assign({}, userDefaultTXOptions, { from: new types_1.AddressType(userDefaultTXOptions.from) });
        return _this;
    }
    Object.defineProperty(EVMLC.prototype, "defaultFrom", {
        /**
         * The default `from` address that will be used for any transactions
         * created from this object.
         */
        get: function () {
            return this.defaultTXOptions.from.value;
        },
        /**
         * Should allow you to set the default `from` to be used for any
         * transactions created from this object.
         */
        set: function (address) {
            this.defaultTXOptions.from = new types_1.AddressType(address);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EVMLC.prototype, "defaultGas", {
        /**
         * The default `gas` value that will be used for any transactions created
         * from this object.
         */
        get: function () {
            return this.defaultTXOptions.gas;
        },
        /**
         * Should allow you to set the default `gas` value to be used for any
         * transactions created from this object.
         */
        set: function (gas) {
            this.defaultTXOptions.gas = gas;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EVMLC.prototype, "defaultGasPrice", {
        /**
         * The default `gasPrice` value that will be used for any transactions
         * created from this object.
         */
        get: function () {
            return this.defaultTXOptions.gasPrice;
        },
        /**
         * Should allow you to set the default `gasPrice` to be used for any
         * transactions created from this object.
         */
        set: function (gasPrice) {
            this.defaultTXOptions.gasPrice = gasPrice;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Should generate a contract abstraction class to interact with the
     * respective contract.
     *
     * @description
     * This function will also fetch the nonce from the node with connection
     * details specified in the contructor for this class.
     *
     * @param abi - The interface of the respective contract.
     * @param options - (optional) The `data` and `contractAddress` options.
     */
    EVMLC.prototype.loadContract = function (abi, options) {
        var _this = this;
        if (!this.defaultTXOptions.from.value) {
            throw new Error('Default from address cannot be left blank or empty!');
        }
        var data = (options && options.data) || '';
        var address = options && options.contractAddress
            ? new types_1.AddressType(options.contractAddress)
            : undefined;
        return this.getAccount(this.defaultFrom.trim()).then(function (account) {
            return new SolidityContract_1.default({
                from: _this.defaultTXOptions.from,
                interface: abi,
                gas: _this.defaultTXOptions.gas,
                gasPrice: _this.defaultTXOptions.gasPrice,
                nonce: account.nonce,
                address: address,
                data: data
            }, _this.host, _this.port);
        });
    };
    /**
     * Should prepare a transaction to transfer `value` to the specified `to`
     * address.
     *
     * @description
     * This function will also fetch the nonce from the node with connection
     * details specified in the contructor for this class.
     *
     * @param to - The address to transfer funds to.
     * @param value - The amount to transfer.
     * @param from - (optional) Overrides `from` address set in the constructor.
     */
    EVMLC.prototype.prepareTransfer = function (to, value, from) {
        var _this = this;
        var fromObject = new types_1.AddressType((from || this.defaultFrom).trim());
        if (!fromObject.value) {
            throw new Error('Default `from` address cannot be left blank or empty.');
        }
        if (!to) {
            throw new Error('Must provide a `to` address!');
        }
        if (value <= 0) {
            throw new Error('A transfer of funds must have a `value` greater than 0.');
        }
        return this.getAccount(fromObject.value).then(function (account) {
            return new Transaction_1.default({
                from: fromObject,
                to: new types_1.AddressType(to.trim()),
                value: value,
                gas: _this.defaultGas,
                gasPrice: _this.defaultGasPrice,
                nonce: account.nonce,
                chainId: 1
            }, _this.host, _this.port, false);
        });
    };
    return EVMLC;
}(DefaultClient_1.default));
exports.default = EVMLC;
