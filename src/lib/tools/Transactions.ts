import {SentTx} from "../../";


export default class Transactions {

    constructor(private dbPath: string, private transactions: SentTx[]) {
        this.sort();
    }

    public all(): SentTx[] {
        return this.transactions;
    }

    public add(tx: any): void {
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

    public get(hash: string) {
        if (!hash.startsWith('0x')) {
            hash = `0x${hash}`;
        }
        return this.transactions.filter(tx => {
            return hash === tx.txHash;
        })[0] || null;
    }

    public sort() {
        this.transactions.sort((a, b)  => {
            // @ts-ignore
            return new Date(b.date) - new Date(a.date);
        });
    }

}
