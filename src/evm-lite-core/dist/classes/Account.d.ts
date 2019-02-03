import { Account as Web3Account, EncryptedKeystoreV3Json } from 'web3-eth-accounts';
import { BaseAccount } from '../client/AccountClient';
import { ParsedTX, SignedTransaction } from './Transaction';
export declare type V3JSONKeyStore = EncryptedKeystoreV3Json;
export default class Account {
    readonly address: string;
    readonly privateKey: string;
    balance: number;
    nonce: number;
    private readonly account;
    constructor(data: Web3Account);
    sign(message: string): any;
    signTransaction(tx: ParsedTX): Promise<SignedTransaction>;
    encrypt(password: string): V3JSONKeyStore;
    toBaseAccount(): BaseAccount;
}
