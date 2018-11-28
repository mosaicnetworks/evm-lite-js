"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Transactions {
    constructor(dbPath, transactions) {
        this.dbPath = dbPath;
        this.transactions = transactions;
        this.sort();
    }
    all() {
        return this.transactions;
    }
    add(tx) {
        delete tx.chainId;
        delete tx.data;
        tx.value = parseInt(tx.value, 16);
        tx.gas = parseInt(tx.gas, 16);
        tx.gasPrice = parseInt(tx.gasPrice, 16);
        tx.nonce = parseInt(tx.nonce, 16);
        tx.date = new Date();
        this.transactions.push(tx);
        this.sort();
    }
    get(hash) {
        if (!hash.startsWith('0x')) {
            hash = `0x${hash}`;
        }
        return this.transactions.filter(tx => {
            return hash === tx.txHash;
        })[0] || null;
    }
    sort() {
        this.transactions.sort((a, b) => {
            // @ts-ignore
            return new Date(b.date) - new Date(a.date);
        });
    }
}
exports.default = Transactions;
