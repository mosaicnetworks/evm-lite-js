import * as LowDB from 'lowdb';
import { DatabaseSchema, TransactionSchema } from '../Database';
import TransactionFilter from '../filters/Transaction';
import TransactionSchemaClass from '../schemas/Transaction';
export default class Transaction {
    private readonly database;
    private readonly schema;
    constructor(database: LowDB.LowdbSync<DatabaseSchema>);
    /**
     * @description Mutates database.
     */
    insert(tx: TransactionSchema | TransactionSchemaClass): Promise<void>;
    create(tx?: TransactionSchema): TransactionSchemaClass;
    list(): Promise<TransactionSchema[]>;
    filter(): Promise<TransactionFilter>;
    get(hash: string): Promise<TransactionSchema>;
}
