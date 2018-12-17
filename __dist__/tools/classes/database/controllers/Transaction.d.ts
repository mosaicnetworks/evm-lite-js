import * as LowDB from "lowdb";
import { DatabaseSchema, TransactionSchema } from "../Database";
export default class Transaction {
    private readonly database;
    constructor(database: LowDB.LowdbSync<DatabaseSchema>);
    add(tx: TransactionSchema): Promise<void>;
    list(): Promise<TransactionSchema[]>;
    get(hash: string): Promise<TransactionSchema>;
}
