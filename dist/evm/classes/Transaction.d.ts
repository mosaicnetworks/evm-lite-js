import { TX, TXReceipt } from "../utils/Interfaces";
import TransactionClient from "../client/TransactionClient";
export default class Transaction extends TransactionClient {
    private tx;
    private constant;
    private readonly unpackfn?;
    receipt?: TXReceipt;
    constructor(tx: TX, host: string, port: number, constant: boolean, unpackfn?: ((data: string) => any) | undefined);
    send(options?: {
        to?: string;
        from?: string;
        value?: number;
        gas?: number;
        gasPrice?: number;
    }): Promise<TXReceipt>;
    call(options?: {
        to?: string;
        from?: string;
        value?: number;
        gas?: number;
        gasPrice?: number;
    }): Promise<string>;
    toString(): string;
    from(from: string): this;
    to(to: string): this;
    value(value: number): this;
    gas(gas: number): this;
    gasPrice(gasPrice: number): this;
    data(data: string): this;
}
