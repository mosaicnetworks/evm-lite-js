import { SentTX } from '../../..';
import { Gas, GasPrice, Nonce, Value } from '../../../evm/types';
export declare type TransactionSchema = SentTX;
export default class Transaction {
    private readonly data;
    constructor(sentTX?: TransactionSchema);
    readonly raw: TransactionSchema;
    date(value: any): this;
    from(value: string): this;
    gas(value: Gas): this;
    gasPrice(value: GasPrice): this;
    nonce(value: Nonce): this;
    to(value: string): this;
    txHash(value: string): this;
    value(value: Value): this;
}
