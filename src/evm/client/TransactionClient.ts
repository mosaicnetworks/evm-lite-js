import * as JSONBig from "json-bigint";

import BaseClient, {request} from "./BaseClient";


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

    constructor(host: string, port: number) {
        super(host, port)
    }

    public callTX(tx: string): Promise<Readonly<string>> {
        return request(this.options('POST', '/call'), tx)
            .then((response) => response)
    }

    public sendTX(tx: string): Promise<Readonly<string>> {
        return request(this.options('POST', '/tx'), tx)
            .then((response) => response)
    }

    public sendRaw(tx: string): Promise<Readonly<SentRawTXResponse>> {
        return request(this.options('POST', '/rawtx'), tx)
            .then((response) => JSONBig.parse<SentRawTXResponse>(response))
    }

    public getReceipt(txHash: string): Promise<Readonly<TXReceipt>> {
        return request(this.options('GET', `/tx/${txHash}`))
            .then((response: string) => JSONBig.parse<TXReceipt>(response))
    }

}