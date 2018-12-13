import * as JSONBig from 'json-bigint'

import {BaseAccount, TXReceipt} from "../utils/Interfaces";

import BaseClient, {request} from "./BaseClient";


export default abstract class Client extends BaseClient {

    protected constructor(host: string, port: number) {
        super(host, port)
    }

    public getAccount(address: string): Promise<BaseAccount | null> {
        return request(null, this.options('GET', `/account/${address}`))
            .then((response: string) => {
                const account: BaseAccount = JSONBig.parse(response);
                if (typeof account.balance === 'object') {
                    account.balance = account.balance.toFormat(0);
                }
                return account
            })
            .catch(() => null);
    }

    public testConnection(): Promise<boolean | null> {
        return request(null, this.options('GET', '/info'))
            .then(() => true)
            .catch(() => null);
    }

    public getAccounts(): Promise<BaseAccount[] | null> {
        return request(null, this.options('GET', '/accounts'))
            .then((response: string) => {
                const json: { accounts: BaseAccount[] } = JSONBig.parse(response);
                if (json.accounts) {
                    return json.accounts.map((account: BaseAccount) => {
                        if (typeof account.balance === 'object') {
                            account.balance = account.balance.toFormat(0);
                        }
                        return account
                    });
                } else {
                    return []
                }
            })
            .catch(() => null);
    }

    public getInfo(): Promise<object | null> {
        return request(null, this.options('GET', '/info'))
            .then((response: string) => JSONBig.parse(response))
            .catch(() => null);
    }

    public call(tx: string): Promise<string | null> {
        return request(tx, this.options('POST', '/call'))
            .then((response) => response)
            .catch(() => null);
    }

    public sendTx(tx: string): Promise<string | null> {
        return request(tx, this.options('POST', '/tx'))
            .then((response) => response)
            .catch(() => null);
    }

    public sendRawTx(tx: string): Promise<string | null> {
        return request(tx, this.options('POST', '/rawtx'))
            .then((response) => response)
    }

    public getReceipt(txHash: string): Promise<TXReceipt | null> {
        return request(null, this.options('GET', `/tx/${txHash}`))
            .then((response: string) => JSONBig.parse<TXReceipt>(response))
            .catch(() => null);
    }


}
