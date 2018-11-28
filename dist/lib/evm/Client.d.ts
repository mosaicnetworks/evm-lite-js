import { BaseAccount, TXReceipt } from "./utils/Interfaces";
export default class Client {
    readonly host: string;
    readonly port: number;
    constructor(host: string, port: number);
    getAccount(address: string): Promise<BaseAccount | void>;
    testConnection(): Promise<boolean | null>;
    getAccounts(): Promise<BaseAccount[] | void>;
    getInfo(): Promise<object | null>;
    call(tx: string): Promise<string | void>;
    sendTx(tx: string): Promise<string | void>;
    sendRawTx(tx: string): Promise<string | void>;
    getReceipt(txHash: string): Promise<TXReceipt | null>;
    private _constructOptions;
}
