import { Nonce } from '../types';
import BaseClient from './BaseClient';
export interface BaseAccount {
    address: string;
    nonce: Nonce;
    balance: any;
}
export default class AccountClient extends BaseClient {
    constructor(host: string, port: number);
    getAccount(address: string): Promise<Readonly<BaseAccount>>;
    getAccounts(): Promise<Readonly<BaseAccount[]>>;
}
