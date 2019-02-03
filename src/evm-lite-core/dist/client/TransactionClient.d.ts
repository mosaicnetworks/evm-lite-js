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
export interface RawTXSubmitResponse {
    txHash: string;
}
export interface SendTXResponse {
    txHash: string;
}
export default class TransactionClient extends BaseClient {
    constructor(host: string, port: number);
    protected callTX(tx: string): Promise<Readonly<string>>;
    protected sendTX(tx: string): Promise<Readonly<SendTXResponse>>;
    protected sendRaw(tx: string): Promise<Readonly<RawTXSubmitResponse>>;
    protected getReceipt(txHash: string): Promise<Readonly<TXReceipt>>;
}
