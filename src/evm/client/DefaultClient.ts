import * as JSONBig from 'json-bigint'

import {BaseAccount} from "../utils/Interfaces";

import {request} from "./BaseClient";
import TransactionClient from "./TransactionClient";


export default abstract class DefaultClient extends TransactionClient {

    protected constructor(host: string, port: number) {
        super(host, port)
    }

    public getAccount(address: string): Promise<BaseAccount | null> {
        return request(this.options('GET', `/account/${address}`))
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
        return request(this.options('GET', '/info'))
            .then(() => true)
            .catch(() => null);
    }

    public getAccounts(): Promise<BaseAccount[] | null> {
        return request(this.options('GET', '/accounts'))
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
        return request(this.options('GET', '/info'))
            .then((response: string) => JSONBig.parse(response))
            .catch(() => null);
    }

}
