import Web3Accounts from 'web3-eth-accounts';

import {BaseAccount, V3JSONKeyStore, Web3Account} from "./utils/Interfaces";


export default class Account {

    get sign(): (data: string) => any {
        return this._account.sign
    }

    get address(): string {
        return this._account.address
    }

    get privateKey(): string {
        return this._account.privateKey
    }

    public static create(): Account {
        return new Account(true)
    }

    public static decrypt(v3JSONKeyStore: V3JSONKeyStore, password: string) {
        const decryptedAccount = new Web3Accounts().decrypt(v3JSONKeyStore, password);
        return new Account(false, decryptedAccount);
    }

    public balance: number = 0;
    public nonce: number = 0;
    private _account: Web3Account;

    constructor(create: boolean = true, aJSON?: Web3Account) {
        if (create) {
            this._account = new Web3Accounts().create();
        } else {
            if (aJSON) {
                this._account = aJSON;
            } else {
                throw new Error('Account JSON needs to be passed to construct class');
            }
        }
    }

    public signTransaction(tx: any): any {
        return this._account.signTransaction(tx);
    }

    public encrypt(password: string): V3JSONKeyStore {
        return this._account.encrypt(password);
    }

    public toBaseAccount(): BaseAccount {
        return {
            address: this.address,
            balance: this.balance,
            nonce: this.nonce
        }
    }

}