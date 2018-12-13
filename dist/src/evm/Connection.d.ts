import { BaseTX } from "./utils/Interfaces";
import Transaction from "./classes/Transaction";
import DefaultClient from "./client/DefaultClient";
interface DefaultTXOptions extends BaseTX {
    from: string;
}
export default class Connection extends DefaultClient {
    private readonly defaultTXOptions;
    constructor(host: string, port: number, defaultTXOptions: DefaultTXOptions);
    readonly defaultOptions: DefaultTXOptions;
    defaultFrom: string;
    defaultGas: number;
    defaultGasPrice: number;
    prepareTransfer(to: string, value: number, from?: string): Transaction;
}
export {};
