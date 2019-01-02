import { SentTX } from '../../..';
import { Gas, GasPrice, Nonce, Value } from '../../../evm/types';
export default class Transaction {
    private readonly data;
    constructor(sentTX?: SentTX);
    readonly raw: SentTX;
    date(value: any): this;
    from(value: string): this;
    gas(value: Gas): this;
    gasPrice(value: GasPrice): this;
    nonce(value: Nonce): this;
    to(value: string): this;
    txHash(value: string): this;
    value(value: Value): this;
}
