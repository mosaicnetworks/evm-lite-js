import { TX, TXReceipt } from "./utils/Interfaces";
import { Controller } from "../../";
export default class Transaction {
    private _tx;
    readonly constant: boolean;
    readonly unpackfn: (output: string) => any;
    readonly controller: Controller;
    receipt: TXReceipt;
    constructor(_tx: TX, constant: boolean, unpackfn: (output: string) => any, controller: Controller);
    send(options?: {
        to?: string;
        from?: string;
        value?: number;
        gas?: number;
        gasPrice?: number;
    }): any;
    call(options?: {
        to?: string;
        from?: string;
        value?: number;
        gas?: number;
        gasPrice?: number;
    }): Promise<any>;
    toString(): string;
    from(from: string): this;
    to(to: string): this;
    value(value: number): this;
    gas(gas: number): this;
    gasPrice(gasPrice: number): this;
    data(data: string): this;
}
