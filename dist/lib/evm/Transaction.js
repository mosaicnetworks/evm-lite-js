"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSONBig = require("json-bigint");
class Transaction {
    constructor(_tx, constant, unpackfn, controller) {
        this._tx = _tx;
        this.constant = constant;
        this.unpackfn = unpackfn;
        this.controller = controller;
        this.receipt = undefined;
        if (!constant) {
            this.unpackfn = undefined;
        }
    }
    send(options) {
        if (!this.constant) {
            if (options) {
                this._tx.to = options.to || this._tx.to;
                this._tx.from = options.from || this._tx.from;
                this._tx.gas = options.gas || this._tx.gas;
                this._tx.value = options.value || this._tx.value;
                if (options.gasPrice !== undefined && options.gasPrice >= 0) {
                    this._tx.gasPrice = options.gasPrice;
                }
            }
            if (this._tx.gas != null && this._tx.gasPrice != null) {
                return this.controller.api.sendTx(JSONBig.stringify(this._tx))
                    .then((res) => {
                    const response = JSONBig.parse(res);
                    return response.txHash;
                })
                    .then((txHash) => {
                    return new Promise((resolve) => setTimeout(resolve, 2000))
                        .then(() => {
                        return this.controller.api.getReceipt(txHash);
                    });
                })
                    .then((resp) => {
                    this.receipt = resp;
                    return this.receipt;
                });
            }
            else {
                throw new Error('gas & gas price not set');
            }
        }
        else {
            throw new Error('Transaction does not mutate state. Use `call()` instead');
        }
    }
    call(options) {
        if (this.constant) {
            if (options) {
                this._tx.to = options.to || this._tx.to;
                this._tx.from = options.from || this._tx.from;
                this._tx.gas = options.gas || this._tx.gas;
                this._tx.value = options.value || this._tx.value;
                if (options.gasPrice !== undefined && options.gasPrice >= 0) {
                    this._tx.gasPrice = options.gasPrice;
                }
            }
            if (this._tx.gas != null && this._tx.gasPrice != null) {
                return this.controller.api.call(JSONBig.stringify(this._tx))
                    .then((response) => {
                    return JSONBig.parse(response);
                })
                    .then((obj) => {
                    return this.unpackfn(Buffer.from(obj.data).toString());
                });
            }
            else {
                throw new Error('gas & gas price not set');
            }
        }
        else {
            throw new Error('Transaction mutates state. Use `send()` instead');
        }
    }
    toString() {
        return JSONBig.stringify(this._tx);
    }
    from(from) {
        this._tx.from = from;
        return this;
    }
    to(to) {
        this._tx.to = to;
        return this;
    }
    value(value) {
        this._tx.value = value;
        return this;
    }
    gas(gas) {
        this._tx.gas = gas;
        return this;
    }
    gasPrice(gasPrice) {
        this._tx.gasPrice = gasPrice;
        return this;
    }
    data(data) {
        this._tx.data = data;
        return this;
    }
}
exports.default = Transaction;
