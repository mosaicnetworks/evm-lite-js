import { SentTX } from "../../evm/classes/Transaction";
import Transactions from "./Transactions";
interface Schema {
    transactions: SentTX[];
}
export default class Database {
    readonly path: string;
    static initial(): {
        transactions: never[];
    };
    transactions: Transactions;
    readonly data: Schema;
    constructor(path: string);
    save(): Promise<boolean>;
}
export {};
