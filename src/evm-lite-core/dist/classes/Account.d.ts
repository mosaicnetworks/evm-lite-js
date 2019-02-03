import { Account as Web3Account } from 'web3-eth-accounts';
import { BaseAccount } from '../client/AccountClient';
import Transaction, { SignedTransaction, TX } from './Transaction';
export interface KDFEncryption {
    ciphertext: string;
    ciperparams: {
        iv: string;
    };
    cipher: string;
    kdf: string;
    kdfparams: {
        dklen: number;
        salt: string;
        n: number;
        r: number;
        p: number;
    };
    mac: string;
}
export interface V3JSONKeyStore {
    version: number;
    id: string;
    address: string;
    crypto: KDFEncryption;
}
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
