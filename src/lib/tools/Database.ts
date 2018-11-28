import * as fs from "fs";
import * as JSONBig from 'json-bigint';

import {SentTx} from "../../";

import DataDirectory from "./DataDirectory";
import Transactions from "./Transactions";


interface Schema {
    transactions: SentTx[],
}

export default class Database {

    public static initial() {
        return {
            transactions: [],
        }
    }

    public transactions: Transactions;
    public readonly data: Schema;

    constructor(readonly path: string) {
        this.data = JSONBig.parse(DataDirectory.createOrReadFile(path, JSONBig.stringify(Database.initial())));
        this.transactions = new Transactions(this.path, this.data.transactions);
    }

    public async save(): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            this.data.transactions = this.transactions.all();
            fs.writeFile(this.path, JSONBig.stringify(this.data), (err) => resolve(!err));
        });
    }
}