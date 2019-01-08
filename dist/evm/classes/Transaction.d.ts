import { Address, ChainID, Data, Gas, GasPrice, Nonce, Value } from '../types';
import TransactionClient, { TXReceipt } from '../client/TransactionClient';
import Account from './Account';
export interface SentTX {
    from: string;
    to: string;
    value: Value;
    gas: Gas;
    nonce: Nonce;
    gasPrice: GasPrice;
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
    value?: Value;
    gas?: Gas;
    gasPrice?: GasPrice;
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
    txReceipt?: TXReceipt;
    signedTX?: SignedTransaction;
    hash?: string;
    constructor(tx: TX, host: string, port: number, constant: boolean, unpackfn?: ((data: string) => any) | undefined);
    send(options?: OverrideTXOptions): Promise<TXReceipt>;
    submit(options?: OverrideTXOptions): Promise<string>;
    sign(account: Account): Promise<this>;
    readonly receipt: Promise<Readonly<TXReceipt>>;
    call(options?: OverrideTXOptions): Promise<string>;
    toString(): string;
    from(from: string): this;
    to(to: string): this;
    value(value: Value): this;
    gas(gas: Gas): this;
    gasPrice(gasPrice: GasPrice): this;
    data(data: Data): this;
    private assignTXValues;
    private checkGasAndGasPrice;
}
export {};
