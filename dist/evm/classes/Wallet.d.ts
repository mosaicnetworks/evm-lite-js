import AccountClient from '../client/AccountClient';
import Account, { V3JSONKeyStore } from './Account';
export default class Wallet extends AccountClient {
    static decrypt(v3JSONKeyStore: V3JSONKeyStore, password: string): Account;
    constructor(host: string, port: number);
    add(): void;
    remove(): void;
    clear(): void;
    encrypt(): void;
}
