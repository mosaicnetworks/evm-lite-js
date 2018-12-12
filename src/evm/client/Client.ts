import * as http from 'http'
import * as JSONBig from 'json-bigint'

import {BaseAccount, TXReceipt} from "../utils/Interfaces";


const request = (tx: string | null, options: any): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const req = http.request(options, (response) => {
            let data = '';
            response.on('data', (chunk) => data += chunk);
            response.on('end', () => resolve(data));
            response.on('error', (err) => reject(err));
        });
        req.on('error', (err) => reject(err));
        if (tx) {
            req.write(tx);
        }
        req.end();
    });
};

export default class Client {

    public constructor(readonly host: string, readonly port: number) {
    }

    public getAccount(address: string): Promise<BaseAccount | null> {
        return request(null, this.constructOptions('GET', `/account/${address}`))
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
        return request(null, this.constructOptions('GET', '/info'))
            .then(() => true)
            .catch(() => null);
    }

    public getAccounts(): Promise<BaseAccount[] | null> {
        return request(null, this.constructOptions('GET', '/accounts'))
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
        return request(null, this.constructOptions('GET', '/info'))
            .then((response: string) => JSONBig.parse(response))
            .catch(() => null);
    }

    public call(tx: string): Promise<string | null> {
        return request(tx, this.constructOptions('POST', '/call'))
            .then((response) => response)
            .catch(() => null);
    }

    public sendTx(tx: string): Promise<string | null> {
        return request(tx, this.constructOptions('POST', '/tx'))
            .then((response) => response)
            .catch(() => null);
    }

    public sendRawTx(tx: string): Promise<string | null> {
        return request(tx, this.constructOptions('POST', '/rawtx'))
            .then((response) => response)
    }

    public getReceipt(txHash: string): Promise<TXReceipt | null> {
        return request(null, this.constructOptions('GET', `/tx/${txHash}`))
            .then((response: string) => JSONBig.parse<TXReceipt>(response))
            .catch(() => null);
    }

    private constructOptions(method: string, path: string) {
        return {
            host: this.host,
            port: this.port,
            method,
            path
        }
    }

}
