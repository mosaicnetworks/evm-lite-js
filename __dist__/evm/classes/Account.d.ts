import { Account as Web3Account, V3JSONKeyStore } from 'web3-eth-accounts';
import { BaseAccount } from "../..";
import Transaction, { SignedTransaction, TX } from './Transaction';
export default class Account {
    readonly address: string;
    readonly privateKey: string;
    static decrypt(v3JSONKeyStore: V3JSONKeyStore, password: string): Account;
    balance: number;
    nonce: number;
    private readonly account;
    constructor(data?: Web3Account);
    sign(message: string): any;
    signTransaction(tx: TX | Transaction): Promise<SignedTransaction>;
    encrypt(password: string): V3JSONKeyStore;
    toBaseAccount(): BaseAccount;
}
