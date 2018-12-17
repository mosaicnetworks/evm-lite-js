import { TXReceipt } from "../..";
import BaseClient from "./BaseClient";
export default class TransactionClient extends BaseClient {
    constructor(host: string, port: number);
    callTX(tx: string): Promise<Readonly<string>>;
    sendTX(tx: string): Promise<Readonly<string>>;
    sendRaw(tx: string): Promise<Readonly<string>>;
    getReceipt(txHash: string): Promise<Readonly<TXReceipt>>;
}
