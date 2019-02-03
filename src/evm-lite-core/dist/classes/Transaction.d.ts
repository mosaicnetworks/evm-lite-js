import { Address, ChainID, Data, Gas, GasPrice, Nonce, Value } from '../types';
import TransactionClient, { TXReceipt } from '../client/TransactionClient';
import Account from './Account';
export interface CallTXResponse {
    data: string;
}
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
export interface ParsedTX extends BaseTX {
    from: string;
    to?: string;
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
    private tx;
    private constant;
    private readonly unpackfn?;
    txReceipt?: TXReceipt;
    signedTX?: SignedTransaction;
    hash?: string;
    constructor(tx: TX, host: string, port: number, constant: boolean, unpackfn?: ((data: string) => any) | undefined);
    readonly receipt: Promise<Readonly<TXReceipt>>;
    /**
     * Send a transaction to a node for a controlled account.
     *
     * @param options - Override transactions options
     *
     * @deprecated
     */
    send(options?: OverrideTXOptions): Promise<TXReceipt>;
    /**
     * Should `send()` or `call()` the transaction or message dependent on
     * whether the transaction or message mutates the state.
     *
     * @param options - (optional) Override transaction options.
     * @param account - (optional) The account to sign this transaction.
     */
    submit(options?: OverrideTXOptions, account?: Account): Promise<this | string>;
    sign(account: Account): Promise<this>;
    call(options?: OverrideTXOptions): Promise<string>;
    parseToString(): string;
    from(from: string): this;
    nonce(nonce: number): this;
    chainID(chainId: number): this;
    to(to: string): this;
    value(value: Value): this;
    gas(gas: Gas): this;
    gasPrice(gasPrice: GasPrice): this;
    data(data: Data): this;
    private parseTransaction;
    private assignTXValues;
}
export {};
