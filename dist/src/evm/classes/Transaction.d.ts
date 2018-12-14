import { Address, ChainID, Data, Gas, GasPrice, Nonce, Value } from "../types";
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
    to?: string;
    from?: string;
    value?: number;
    gas?: number;
    gasPrice?: number;
}
export interface SignedTransaction {
    messageHash: string;
    v: string;
    r: string;
    s: string;
    rawTransaction: string;
}
export default class Transaction extends TransactionClient {
    tx: TX;
    private constant;
    private readonly unpackfn?;
    receipt?: TXReceipt;
    constructor(tx: TX, host: string, port: number, constant: boolean, unpackfn?: ((data: string) => any) | undefined);
    send(options?: OverrideTXOptions): Promise<TXReceipt>;
    call(options?: OverrideTXOptions): Promise<string>;
    sign(account: Account): SignedTransaction;
    toString(): string;
    from(from: string): this;
    to(to: string): this;
    value(value: number): this;
    gas(gas: number): this;
    gasPrice(gasPrice: number): this;
    data(data: string): this;
    private assignTXValues;
    private checkGasAndGasPrice;
}
export {};
