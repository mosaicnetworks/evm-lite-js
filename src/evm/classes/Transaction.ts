import * as JSONBig from 'json-bigint'

import {Address, AddressType, ChainID, Data, Gas, GasPrice, Nonce, parseTransaction, Value} from "../types";

import TransactionClient from "../client/TransactionClient";
import Account from "./Account";


export interface TXReceipt {
    root: string;
    transactionHash: string;
    from: string;
    to?: string;
    gasUsed: number;
    cumulativeGasUsed: number;
    contractAddress: string;
    logs: [];
    logsBloom: string;
    status: number;
}

export interface SentTX {
    from: string;
    to: string;
    value: number;
    gas: number;
    nonce: number;
    gasPrice: number;
    date: any;
    txHash: string;
}

export interface BaseTX {
    gas: Gas;
    gasPrice: GasPrice;
    nonce?: Nonce;
    chainId?: ChainID;
}

export interface TX extends BaseTX {
    from: Address;
    to?: Address;
    value?: Value;
    data?: Data;
}

interface OverrideTXOptions {
    to?: string,
    from?: string,
    value?: number,
    gas?: number,
    gasPrice?: number
}

export interface SignedTransaction {
    messageHash: string;
    v: string;
    r: string;
    s: string;
    rawTransaction: string;
}

export default class Transaction extends TransactionClient {

    public receipt?: TXReceipt;

    constructor(public tx: TX, host: string, port: number, private constant: boolean, private readonly unpackfn?: (data: string) => any) {
        super(host, port)
    }

    public send(options?: OverrideTXOptions): Promise<TXReceipt> {
        this.assignTXValues(options);
        this.checkGasAndGasPrice();

        if (this.constant) {
            throw new Error('Transaction does not mutate state. Use `call()` instead')
        }

        if (!this.tx.data && !this.tx.value) {
            throw new Error('Transaction does have a value to send.')
        }

        return this.sendTX(JSONBig.stringify(parseTransaction(this.tx)))
            .then((res) => {
                const response: { txHash: string } = JSONBig.parse(res);
                return response.txHash
            })
            .then((txHash) => {
                return this.getReceipt(txHash)
            })
            .then((response) => {
                this.receipt = response;
                return this.receipt;
            })
    }

    public call(options?: OverrideTXOptions): Promise<string> {
        this.assignTXValues(options);
        this.checkGasAndGasPrice();

        if (!this.constant) {
            throw new Error('Transaction mutates state. Use `send()` instead')
        }

        if (this.tx.value) {
            throw new Error('Transaction cannot have value if it does not intend to mutate state.')
        }

        return this.callTX(JSONBig.stringify(parseTransaction(this.tx)))
            .then((response) => {
                return JSONBig.parse(response);
            })
            .then((obj: any) => {
                if (!this.unpackfn) {
                    throw new Error('Unpacking function required.')
                }

                return this.unpackfn(Buffer.from(obj.data).toString());
            });
    }

    public sign(account: Account): Promise<SignedTransaction> {
        return account.signTransaction(this.tx)
    }

    public toString(): string {
        return JSONBig.stringify(parseTransaction(this.tx));
    }

    public from(from: string): this {
        this.tx.from = new AddressType(from);
        return this
    }

    public to(to: string): this {
        this.tx.to = new AddressType(to);
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

    private assignTXValues(options?: OverrideTXOptions) {
        if (options) {
            this.tx.to = (options.to) ? new AddressType(options.to) : this.tx.to;
            this.tx.from = (options.from) ? new AddressType(options.from) : this.tx.from;

            this.tx.gas = options.gas || this.tx.gas;
            this.tx.value = options.value || this.tx.value;
            this.tx.gasPrice = options.gasPrice || this.tx.gasPrice;
        }
    }

    private checkGasAndGasPrice() {
        if (!this.tx.gas || (!this.tx.gasPrice && this.tx.gasPrice !== 0)) {
            throw new Error('Gas & Gas Price not set');
        }
    }

}