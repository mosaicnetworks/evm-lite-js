import { SentTX } from '../..';
import TransactionController from './controllers/Transaction';
export declare type TransactionSchema = SentTX;
export interface DatabaseSchema {
    transactions: TransactionSchema[];
}
export default class Database {
    private readonly directory;
    private readonly name;
    readonly path: string;
    readonly transactions: TransactionController;
    private readonly database;
    constructor(directory: string, name: string);
}
