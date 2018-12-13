import * as JSONBig from 'json-bigint'

import {TX, TXReceipt} from "../utils/Interfaces";

import TransactionClient from "../client/TransactionClient";


export default class Transaction extends TransactionClient {

    public receipt?: TXReceipt;

    constructor(private tx: TX, host: string, port: number, private constant: boolean, private readonly unpackfn?: (data: string) => any) {
        super(host, port)
    }

    public send(options?: { to?: string, from?: string, value?: number, gas?: number, gasPrice?: number }): Promise<TXReceipt> {
        if (options) {
            this.tx.to = options.to || this.tx.to;
            this.tx.from = options.from || this.tx.from;
            this.tx.gas = options.gas || this.tx.gas;
            this.tx.value = options.value || this.tx.value;
            this.tx.gasPrice = options.gasPrice || this.tx.gasPrice;
        }

        if (!this.tx.gas || (!this.tx.gasPrice && this.tx.gasPrice !== 0)) {
            throw new Error('Gas & Gas price not set');
        }

        if (this.constant) {
            throw new Error('Transaction does not mutate state. Use `call()` instead')
        }

        if (!this.tx.from) {
            throw new Error('Transaction does have a from address.')
        }

        return this.sendTX(JSONBig.stringify(this.tx))
            .then((res) => {
                if (!res) {
                    throw new Error('Something went wrong while submitting the transaction.')
                }
                const response: { txHash: string } = JSONBig.parse(res);
                return response.txHash
            })
            .then((txHash) => {
                return this.getReceipt(txHash)
            })
            .then((response) => {
                if (!response) {
                    throw new Error('Something went wrong while fetching receipt.')
                }
                this.receipt = response;
                return this.receipt;
            })
            .catch((error) => error)
    }

    public call(options?: { to?: string, from?: string, value?: number, gas?: number, gasPrice?: number }): Promise<string> {
        if (options) {
            this.tx.to = options.to || this.tx.to;
            this.tx.from = options.from || this.tx.from;
            this.tx.gas = options.gas || this.tx.gas;
            this.tx.value = options.value || this.tx.value;
            this.tx.gasPrice = options.gasPrice || this.tx.gasPrice;
        }

        if (!this.tx.gas || (!this.tx.gasPrice && this.tx.gasPrice !== 0)) {
            throw new Error('gas & gas price not set');
        }

        if (!this.constant) {
            throw new Error('Transaction mutates state. Use `send()` instead')
        }

        return this.callTX(JSONBig.stringify(this.tx))
            .then((response) => {
                if (!response) {
                    throw new Error('Something went wrong while submitting the transaction.')
                }

                return JSONBig.parse(response);
            })
            .then((obj: any) => {
                if (!this.unpackfn) {
                    throw new Error('Unpacking function required.')
                }
                return this.unpackfn(Buffer.from(obj.data).toString());
            });
    }

    public toString(): string {
        return JSONBig.stringify(this.tx);
    }

    public from(from: string): this {
        this.tx.from = from;
        return this
    }


    public to(to: string): this {
        this.tx.to = to;
        return this
    }


    public value(value: number): this {
        this.tx.value = value;
        return this
    }


    public gas(gas: number): this {
        this.tx.gas = gas;
        return this
    }


    public gasPrice(gasPrice: number): this {
        this.tx.gasPrice = gasPrice;
        return this
    }


    public data(data: string): this {
        this.tx.data = data;
        return this
    }

}