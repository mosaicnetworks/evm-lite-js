import * as JSONBig from 'json-bigint'

import {TX, TXReceipt} from "../utils/Interfaces";

import {Controller} from "../..";


export default class Transaction {

    public receipt: TXReceipt;

    constructor(private _tx: TX, readonly constant: boolean, readonly unpackfn: ((output: string) => any) | null, readonly controller: Controller) {
        this.receipt = undefined;

        if (!constant) {
            this.unpackfn = null;
        }
    }

    public send(options?: { to?: string, from?: string, value?: number, gas?: number, gasPrice?: number }): any {
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
                    .then((res: string) => {
                        const response: { txHash: string } = JSONBig.parse(res);
                        return response.txHash
                    })
                    .then((txHash) => {
                        return new Promise((resolve) => setTimeout(resolve, 2000))
                            .then(() => {
                                return this.controller.api.getReceipt(txHash)
                            })
                    })
                    .then((resp: TXReceipt) => {
                        this.receipt = resp;
                        return this.receipt;
                    })
            } else {
                throw new Error('gas & gas price not set')
            }
        } else {
            throw new Error('Transaction does not mutate state. Use `call()` instead')
        }
    }

    public call(options?: { to?: string, from?: string, value?: number, gas?: number, gasPrice?: number }) {
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
            } else {
                throw new Error('gas & gas price not set')
            }
        } else {
            throw new Error('Transaction mutates state. Use `send()` instead')
        }
    }

    public toString(): string {
        return JSONBig.stringify(this._tx);
    }

    public from(from: string): this {
        this._tx.from = from;
        return this
    }


    public to(to: string): this {
        this._tx.to = to;
        return this
    }


    public value(value: number): this {
        this._tx.value = value;
        return this
    }


    public gas(gas: number): this {
        this._tx.gas = gas;
        return this
    }


    public gasPrice(gasPrice: number): this {
        this._tx.gasPrice = gasPrice;
        return this
    }


    public data(data: string): this {
        this._tx.data = data;
        return this
    }

}