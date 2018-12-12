import Web3Accounts from 'web3-eth-accounts';

import {BaseAccount, V3JSONKeyStore, Web3Account} from "../utils/Interfaces";


export default class Account {

    public balance: number = 0;
    public nonce: number = 0;

    private account: Web3Account;

    constructor(create: boolean = true, aJSON?: Web3Account) {
        if (create) {
            this.account = new Web3Accounts().create();
        } else {
            if (aJSON) {
                this.account = aJSON;
            } else {
                throw new Error('Account AJSON needs to be passed to construct class');
            }
        }
    }

    get sign(): (data: string) => any {
        return this.account.sign
    }

    get address(): string {
        return this.account.address
    }

    get privateKey(): string {
        return this.account.privateKey
    }

    public static create(): Account {
        return new Account(true)
    }

    public static decrypt(v3JSONKeyStore: V3JSONKeyStore, password: string) {
        const decryptedAccount = new Web3Accounts().decrypt(v3JSONKeyStore, password);

        return new Account(false, decryptedAccount);
    }

    public signTransaction(tx: any): any {
        return this.account.signTransaction(tx);
    }

    public encrypt(password: string): V3JSONKeyStore {
        return this.account.encrypt(password);
    }

    public toBaseAccount(): BaseAccount {
        return {
            address: this.address,
            balance: this.balance,
            nonce: this.nonce
        }
    }

}