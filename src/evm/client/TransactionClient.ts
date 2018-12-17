import * as JSONBig from "json-bigint";

import {TXReceipt} from "../..";

import BaseClient, {request} from "./BaseClient";


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

    public sendRaw(tx: string): Promise<Readonly<string>> {
        return request(this.options('POST', '/rawtx'), tx)
            .then((response) => response)
    }

    public getReceipt(txHash: string): Promise<Readonly<TXReceipt>> {
        return request(this.options('GET', `/tx/${txHash}`))
            .then((response: string) => JSONBig.parse<TXReceipt>(response))
    }

}