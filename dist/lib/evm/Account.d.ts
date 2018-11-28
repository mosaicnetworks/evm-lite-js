import { BaseAccount, V3JSONKeyStore, Web3Account } from "./utils/Interfaces";
export default class Account {
    readonly sign: (data: string) => any;
    readonly address: string;
    readonly privateKey: string;
    static create(): Account;
    static decrypt(v3JSONKeyStore: V3JSONKeyStore, password: string): Account;
    balance: number;
    nonce: number;
    private _account;
    constructor(create?: boolean, aJSON?: Web3Account);
    signTransaction(tx: string): any;
    encrypt(password: string): V3JSONKeyStore;
    toBaseAccount(): BaseAccount;
}
