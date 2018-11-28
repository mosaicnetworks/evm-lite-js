import { SentTx } from "../../";
import Transactions from "./Transactions";
interface Schema {
    transactions: SentTx[];
}
export default class Database {
    readonly path: string;
    static initial(): {
        transactions: any[];
    };
    transactions: Transactions;
    readonly data: Schema;
    constructor(path: string);
    save(): Promise<boolean>;
}
export {};
