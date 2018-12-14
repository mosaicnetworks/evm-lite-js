import * as JSONBig from 'json-bigint'

import {BaseAccount} from "../classes/Account";
import {request} from "./BaseClient";

import BaseClient from "./BaseClient";


export default abstract class DefaultClient extends BaseClient {

    protected constructor(host: string, port: number) {
        super(host, port)
    }

    public getAccount(address: string): Promise<BaseAccount> {
        return request(this.options('GET', `/account/${address}`))
            .then((response: string) => {
                const account: BaseAccount = JSONBig.parse(response);
                if (typeof account.balance === 'object') {
                    account.balance = account.balance.toFormat(0);
                }
                return account
            })
    }

    public testConnection(): Promise<boolean> {
        return request(this.options('GET', '/info'))
            .then(() => true)
    }

    public getAccounts(): Promise<BaseAccount[]> {
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
    }

    public getInfo(): Promise<object> {
        return request(this.options('GET', '/info'))
            .then((response: string) => JSONBig.parse(response))
    }

}
