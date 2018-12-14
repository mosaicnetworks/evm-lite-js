import { TXReceipt } from "../classes/Transaction";
import BaseClient from "./BaseClient";
export default class TransactionClient extends BaseClient {
    constructor(host: string, port: number);
    callTX(tx: string): Promise<string>;
    sendTX(tx: string): Promise<string>;
    sendRaw(tx: string): Promise<string>;
    getReceipt(txHash: string): Promise<TXReceipt>;
}
