import Account from './Account';
import { V3JSONKeyStore } from './Account';
export default class Accounts {
    private accounts;
    constructor();
    decrypt(v3JSONKeyStore: V3JSONKeyStore, password: string): Account;
    create(): Account;
}
