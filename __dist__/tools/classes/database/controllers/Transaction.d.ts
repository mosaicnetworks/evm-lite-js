import * as LowDB from "lowdb";
import { DatabaseSchema, TransactionSchema } from "../Database";
import TransactionSchemaClass from '../schemas/Transaction';
export default class Transaction {
    private readonly database;
    private readonly schema;
    constructor(database: LowDB.LowdbSync<DatabaseSchema>);
    add(tx: TransactionSchema | TransactionSchemaClass): Promise<void>;
    create(tx?: TransactionSchema): TransactionSchemaClass;
    list(): Promise<TransactionSchema[]>;
    get(hash: string): Promise<TransactionSchema>;
}
