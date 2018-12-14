import * as Wallet from 'web3-eth-accounts';

import {Account as Web3Account, V3JSONKeyStore} from 'web3-eth-accounts';

import {Nonce} from "../types";
import {TX} from './Transaction';


export interface BaseAccount {
    address: string,
    nonce: Nonce,
    balance: any
}

export default class Account {

    get address(): string {
        return this.account.address
    }

    get privateKey(): string {
        return this.account.privateKey
    }

    public static decrypt(v3JSONKeyStore: V3JSONKeyStore, password: string) {
        // @ts-ignore
        const decryptedAccount = new Wallet().decrypt(v3JSONKeyStore, password);

        return new Account(decryptedAccount);
    }

    public balance: number = 0;
    public nonce: number = 0;
    private readonly account: Web3Account;

    constructor(data?: Web3Account) {
        if (!data) {
            // @ts-ignore
            this.account = new Wallet().create();
        } else {
            this.account = data;
        }
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