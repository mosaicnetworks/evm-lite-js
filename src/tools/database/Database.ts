import * as LowDB from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';
import * as path from 'path';

import { SentTX } from '../..';

import Static from '../classes/Static';
import TransactionController from './controllers/Transaction';


export type TransactionSchema = SentTX;

export interface DatabaseSchema {
	transactions: TransactionSchema[],
}

export default class Database {

	public readonly path: string;
	public readonly transactions: TransactionController;

	private readonly database: LowDB.LowdbSync<DatabaseSchema>;

	constructor(private readonly directory: string, private readonly name: string) {
		this.path = path.join(directory, name);

		if (Static.exists(this.path)) {
			this.database = LowDB(new FileSync(this.path));
		} else {
			const defaults: DatabaseSchema = {
				transactions: []
			};

			this.database = LowDB(new FileSync(this.path));
			this.database.defaults(defaults).write();
		}

		this.transactions = new TransactionController(this.database);
	}

}
