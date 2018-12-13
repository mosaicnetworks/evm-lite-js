import * as Accounts from 'web3-eth-accounts';

import {Account as Web3Account, V3JSONKeyStore} from 'web3-eth-accounts';

import {BaseAccount, TX} from "../utils/Interfaces";


export default class Account {

    public balance: number = 0;
    public nonce: number = 0;
    private readonly account: Web3Account;

    constructor(data?: Web3Account) {
        if (!data) {
            // @ts-ignore
            this.account = new Accounts().create();
        } else {
            this.account = data;
        }
    }

    get address(): string {
        return this.account.address
    }

    get privateKey(): string {
        return this.account.privateKey
    }

    public static decrypt(v3JSONKeyStore: V3JSONKeyStore, password: string) {
        // @ts-ignore
        const decryptedAccount = new Accounts().decrypt(v3JSONKeyStore, password);

        return new Account(decryptedAccount);
    }

    public sign(message: string): any {
        return this.account.sign(message);
    }

    public signTransaction(tx: TX): any {
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