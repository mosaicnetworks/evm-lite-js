import * as JSONBig from "json-bigint";

import {Nonce} from "../types";
import BaseClient, {request} from "./BaseClient";


export interface BaseAccount {
    address: string,
    nonce: Nonce,
    balance: any
}

export default class AccountClient extends BaseClient {

    constructor(host: string, port: number) {
        super(host, port)
    }

    public getAccount(address: string): Promise<Readonly<BaseAccount>> {
        return request(this.options('GET', `/account/${address}`))
            .then((response: string) => {
                const account: BaseAccount = JSONBig.parse(response);
                if (typeof account.balance === 'object') {
                    account.balance = account.balance.toFormat(0);
                }
                return account
            })
    }

    public getAccounts(): Promise<Readonly<BaseAccount[]>> {
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

}