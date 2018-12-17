import * as LowDB from "lowdb";

import {DatabaseSchema, TransactionSchema} from "../Database";


export default class Transaction {

    constructor(private readonly database: LowDB.LowdbSync<DatabaseSchema>) {
    }

    public add(tx: TransactionSchema) {
        return new Promise<void>((resolve) => {
            this.database.get('transactions').push(tx).write();
            resolve();
        });
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