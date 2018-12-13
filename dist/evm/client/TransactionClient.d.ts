import { TXReceipt } from "../classes/Transaction";
import BaseClient from "./BaseClient";
export default abstract class TransactionClient extends BaseClient {
    protected constructor(host: string, port: number);
    callTX(tx: string): Promise<string | null>;
    sendTX(tx: string): Promise<string | null>;
    sendRaw(tx: string): Promise<string | null>;
    getReceipt(txHash: string): Promise<TXReceipt | null>;
}
