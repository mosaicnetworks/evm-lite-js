import * as JSONBig from "json-bigint";

import {TXReceipt} from "../utils/Interfaces";
import BaseClient, {request} from "./BaseClient";


export default abstract class TransactionClient extends BaseClient {

    protected constructor(host: string, port: number) {
        super(host, port)
    }

    public callTX(tx: string): Promise<string | null> {
        return request(tx, this.options('POST', '/call'))
            .then((response) => response)
            .catch(() => null);
    }

    public sendTX(tx: string): Promise<string | null> {
        return request(tx, this.options('POST', '/tx'))
            .then((response) => response)
            .catch(() => null);
    }

    public sendRaw(tx: string): Promise<string | null> {
        return request(tx, this.options('POST', '/rawtx'))
            .then((response) => response)
    }

    public getReceipt(txHash: string): Promise<TXReceipt | null> {
        return request(null, this.options('GET', `/tx/${txHash}`))
            .then((response: string) => JSONBig.parse<TXReceipt>(response))
            .catch(() => null);
    }

}