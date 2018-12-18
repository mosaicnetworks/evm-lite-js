import * as LowDB from "lowdb";

import {DatabaseSchema, TransactionSchema} from "../Database";

import TransactionSchemaClass from '../schemas/Transaction'


export default class Transaction {

    private readonly schema = TransactionSchemaClass;

    constructor(private readonly database: LowDB.LowdbSync<DatabaseSchema>) {
    }

    public add(tx: TransactionSchema | TransactionSchemaClass) {
        return new Promise<void>((resolve) => {
            const txToSubmit: TransactionSchema = (tx instanceof TransactionSchemaClass) ? tx.raw : tx;

            this.database.get('transactions').push(txToSubmit).write();
            resolve();
        });
    }

    public create(tx?: TransactionSchema): TransactionSchemaClass {
        return new this.schema(tx);
    }

    public list(): Promise<TransactionSchema[]> {
        return new Promise<TransactionSchema[]>(resolve => {
            resolve(this.database.getState().transactions);
        });
    }

    public get(hash: string): Promise<TransactionSchema> {
        return new Promise<TransactionSchema>(resolve => {
            const transaction = this.database.get('transactions')
                .find({
                    txHash: hash
                })
                .value();

            resolve(transaction);
        })
    }

}