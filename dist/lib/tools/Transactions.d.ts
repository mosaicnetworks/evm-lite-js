import { SentTx } from "../../";
export default class Transactions {
    private dbPath;
    private transactions;
    constructor(dbPath: string, transactions: SentTx[]);
    all(): SentTx[];
    add(tx: any): void;
    get(hash: string): SentTx;
    sort(): void;
}
