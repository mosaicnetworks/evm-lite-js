import { Account as Web3Account, V3JSONKeyStore } from 'web3-eth-accounts';
import { BaseAccount, TX } from "../utils/Interfaces";
export default class Account {
    balance: number;
    nonce: number;
    private readonly account;
    constructor(data?: Web3Account);
    readonly address: string;
    readonly privateKey: string;
    static decrypt(v3JSONKeyStore: V3JSONKeyStore, password: string): Account;
    sign(message: string): any;
    signTransaction(tx: TX): any;
    encrypt(password: string): V3JSONKeyStore;
    toBaseAccount(): BaseAccount;
}
