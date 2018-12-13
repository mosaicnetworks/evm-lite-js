import { SentTX } from "../evm/utils/Interfaces";
export default class Transactions {
    private dbPath;
    private transactions;
    constructor(dbPath: string, transactions: SentTX[]);
    all(): SentTX[];
    add(tx: any): void;
    get(hash: string): any;
    sort(): void;
}
