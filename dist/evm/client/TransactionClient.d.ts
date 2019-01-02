import BaseClient from './BaseClient';
export interface TXReceipt {
    root: string;
    transactionHash: string;
    from: string;
    to?: string;
    gasUsed: number;
    cumulativeGasUsed: number;
    contractAddress: string;
    logs: [];
    logsBloom: string;
    status: number;
}
interface SentRawTXResponse {
    txHash: string;
}
export default class TransactionClient extends BaseClient {
    constructor(host: string, port: number);
    callTX(tx: string): Promise<Readonly<string>>;
    sendTX(tx: string): Promise<Readonly<string>>;
    sendRaw(tx: string): Promise<Readonly<SentRawTXResponse>>;
    getReceipt(txHash: string): Promise<Readonly<TXReceipt>>;
}
export {};
