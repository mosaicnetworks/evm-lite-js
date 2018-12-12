import * as fs from "fs";
import * as JSONBig from 'json-bigint';
import * as path from "path";

import {Account, BaseAccount, Controller, V3JSONKeyStore} from "../../";


export default class Keystore {

    constructor(readonly path: string) {
    }

    public static create(output: string, password: string): string {
        const account: Account = Account.create();
        const eAccount = account.encrypt(password);
        const sEAccount = JSONBig.stringify(eAccount);
        const filename = `UTC--${JSONBig.stringify(new Date())}--${account.address}`
            .replace(/"/g, '')
            .replace(/:/g, '-');

        fs.writeFileSync(path.join(output, filename), sEAccount);
        return sEAccount;
    }

    public createWithPromise(password: string): Promise<string> {
        return new Promise<string>((resolve) => {
            const account: Account = Account.create();
            const eAccount = account.encrypt(password);
            const sEAccount = JSONBig.stringify(eAccount);
            const filename = `UTC--${JSONBig.stringify(new Date())}--${account.address}`
                .replace(/"/g, '')
                .replace(/:/g, '-');

            fs.writeFileSync(path.join(this.path, filename), sEAccount);
            resolve(sEAccount);
        });
    }

    public importV3JSONKeystore(data: string): Promise<string> {
        return new Promise<string>(resolve => {
            const account: BaseAccount = JSONBig.parse(data);
            const filename = `UTC--${JSONBig.stringify(new Date())}--${account.address}`
                .replace(/"/g, '')
                .replace(/:/g, '-');
            fs.writeFileSync(path.join(this.path, filename), data);
            resolve(account.address);
        })
    }

    public update(address: string, old: string, newPass: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const path = this.find(address);
            let account: Account;

            try {
                account = Account.decrypt(JSONBig.parse(fs.readFileSync(path, 'utf8')), old);
            } catch (e) {
                reject('Decryption with password provided failed!');
                return;
            }

            const accountNew = account.encrypt(newPass);
            fs.writeFileSync(path, JSONBig.stringify(accountNew));
            resolve()
        });
    }

    public files() {
        const json = [];
        const files = fs.readdirSync(this.path).filter((file) => {
            return !(file.startsWith('.'));
        });

        for (const file of files) {
            const filepath = path.join(this.path, file);
            const data = fs.readFileSync(filepath, 'utf8');

            json.push(JSONBig.parse(data));
        }

        return json
    }

    public all(fetch: boolean = false, connection?: Controller): Promise<any[]> {
        return new Promise<any[]>(async (resolve) => {
            const accounts: any[] = [];
            const files = this.files();
            if (files.length) {
                for (const file of files) {
                    const address = file.address;
                    if (fetch && connection) {
                        accounts.push(await connection.api.getAccount(address));
                    } else {
                        accounts.push({
                            address,
                            balance: 0,
                            nonce: 0
                        })
                    }
                }
                resolve(accounts);
            } else {
                resolve(accounts);
            }
        })
    }

    public getWithPromise(address: string): Promise<string> {
        return new Promise<string>(resolve => {
            resolve(JSON.stringify(this.get(address)));
        });
    }

    public get(address: string): V3JSONKeyStore {
        if (address.startsWith('0x')) {
            address = address.substr(2);
        }
        address = address.toLowerCase();
        return this.files().filter((file) => file.address === address)[0] || null;
    }

    public find(address: string): string {
        const dir = fs.readdirSync(this.path).filter((file) => {
            return !(file.startsWith('.'));
        });

        if (address.startsWith('0x')) {
            address = address.substr(2);
        }
        address = address.toLowerCase();

        for (const filename of dir) {
            const filepath = path.join(this.path, filename);
            const account: BaseAccount = JSONBig.parse(fs.readFileSync(filepath, 'utf8'));
            if (account.address === address) {
                return filepath;
            }
        }

        return ''
    }

    public async fetch(address: string, connection: Controller): Promise<BaseAccount> {
        return new Promise<BaseAccount>(async (resolve) => {
            const account = await connection.api.getAccount(address);

            if (account) {
                resolve(account);
            }
        });
    }

}