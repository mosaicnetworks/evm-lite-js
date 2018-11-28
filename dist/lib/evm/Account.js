"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Web3Accounts = require("web3-eth-accounts");
class Account {
    constructor(create = true, aJSON) {
        this.balance = 0;
        this.nonce = 0;
        if (create) {
            this._account = new Web3Accounts().create();
        }
        else {
            if (aJSON) {
                this._account = aJSON;
            }
            else {
                throw new Error('Account JSON needs to be passed to construct class');
            }
        }
    }
    get sign() {
        return this._account.sign;
    }
    get address() {
        return this._account.address;
    }
    get privateKey() {
        return this._account.privateKey;
    }
    static create() {
        return new Account(true);
    }
    static decrypt(v3JSONKeyStore, password) {
        const decryptedAccount = new Web3Accounts().decrypt(v3JSONKeyStore, password);
        return new Account(false, decryptedAccount);
    }
    signTransaction(tx) {
        return this._account.signTransaction(tx);
    }
    encrypt(password) {
        return this._account.encrypt(password);
    }
    toBaseAccount() {
        return {
            address: this.address,
            balance: this.balance,
            nonce: this.nonce
        };
    }
}
exports.default = Account;
