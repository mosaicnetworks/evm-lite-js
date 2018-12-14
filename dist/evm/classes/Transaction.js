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
var types_1 = require("../types");
var TransactionClient_1 = require("../client/TransactionClient");
var Transaction = /** @class */ (function (_super) {
    __extends(Transaction, _super);
    function Transaction(tx, host, port, constant, unpackfn) {
        var _this = _super.call(this, host, port) || this;
        _this.tx = tx;
        _this.constant = constant;
        _this.unpackfn = unpackfn;
        return _this;
    }
    Transaction.prototype.send = function (options) {
        var _this = this;
        this.assignTXValues(options);
        this.checkGasAndGasPrice();
        if (this.constant) {
            throw new Error('Transaction does not mutate state. Use `call()` instead');
        }
        if (!this.tx.value) {
            throw new Error('Transaction does have a from value to send.');
        }
        return this.sendTX(JSONBig.stringify(types_1.parseTransaction(this.tx)))
            .then(function (res) {
            var response = JSONBig.parse(res);
            return response.txHash;
        })
            .then(function (txHash) {
            return _this.getReceipt(txHash);
        })
            .then(function (response) {
            _this.receipt = response;
            return _this.receipt;
        });
    };
    Transaction.prototype.call = function (options) {
        var _this = this;
        this.assignTXValues(options);
        this.checkGasAndGasPrice();
        if (!this.constant) {
            throw new Error('Transaction mutates state. Use `send()` instead');
        }
        if (this.tx.value) {
            throw new Error('Transaction cannot have value if it does not intend to mutate state.');
        }
        return this.callTX(JSONBig.stringify(types_1.parseTransaction(this.tx)))
            .then(function (response) {
            return JSONBig.parse(response);
        })
            .then(function (obj) {
            if (!_this.unpackfn) {
                throw new Error('Unpacking function required.');
            }
            return _this.unpackfn(Buffer.from(obj.data).toString());
        });
    };
    Transaction.prototype.sign = function (account) {
        return account.signTransaction(this.tx);
    };
    Transaction.prototype.toString = function () {
        return JSONBig.stringify(types_1.parseTransaction(this.tx));
    };
    Transaction.prototype.from = function (from) {
        this.tx.from = new types_1.AddressType(from);
        return this;
    };
    Transaction.prototype.to = function (to) {
        this.tx.to = new types_1.AddressType(to);
        return this;
    };
    Transaction.prototype.value = function (value) {
        this.tx.value = value;
        return this;
    };
    Transaction.prototype.gas = function (gas) {
        this.tx.gas = gas;
        return this;
    };
    Transaction.prototype.gasPrice = function (gasPrice) {
        this.tx.gasPrice = gasPrice;
        return this;
    };
    Transaction.prototype.data = function (data) {
        this.tx.data = data;
        return this;
    };
    Transaction.prototype.assignTXValues = function (options) {
        if (options) {
            this.tx.to = (options.to) ? new types_1.AddressType(options.to) : this.tx.to;
            this.tx.from = (options.from) ? new types_1.AddressType(options.from) : this.tx.from;
            this.tx.gas = options.gas || this.tx.gas;
            this.tx.value = options.value || this.tx.value;
            this.tx.gasPrice = options.gasPrice || this.tx.gasPrice;
        }
    };
    Transaction.prototype.checkGasAndGasPrice = function () {
        if (!this.tx.gas || (!this.tx.gasPrice && this.tx.gasPrice !== 0)) {
            throw new Error('Gas & Gas Price not set');
        }
    };
    return Transaction;
}(TransactionClient_1.default));
exports.default = Transaction;
