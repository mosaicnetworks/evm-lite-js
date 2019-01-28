import * as fs from 'fs';
import * as JSONBig from 'json-bigint';
import * as path from 'path';

import { V3JSONKeyStore } from '../..';

import { Account, BaseAccount, EVMLC, Wallet } from '../..';
import Static from './Static';

export default class Keystore {
	public readonly path: string;

	constructor(
		public readonly directory: string,
		public readonly name: string
	) {
		this.path = path.join(directory, name);

		Static.createDirectoryIfNotExists(this.path);
	}

	public async decrypt(address: string, password: string): Promise<Account> {
		const keystore = await this.get(address.toLowerCase());

		return await Wallet.decrypt(keystore, password);
	}

	public create(password: string, output?: string): Promise<string> {
		return new Promise<string>(resolve => {
			const account = new Account();
			const eAccount = account.encrypt(password);
			const sEAccount = JSONBig.stringify(eAccount);
			const filename = `UTC--${JSONBig.stringify(new Date())}--${
				account.address
			}`
				.replace(/"/g, '')
				.replace(/:/g, '-');

			fs.writeFileSync(
				path.join(output || this.path, filename),
				sEAccount
			);
			resolve(sEAccount);
		});
	}

	public import(data: string): Promise<string> {
		return new Promise<string>(resolve => {
			const account: BaseAccount = JSONBig.parse(data);
			const filename = `UTC--${JSONBig.stringify(new Date())}--${
				account.address
			}`
				.replace(/"/g, '')
				.replace(/:/g, '-');
			fs.writeFileSync(path.join(this.path, filename), data);
			resolve(account.address);
		});
	}

	public update(
		address: string,
		old: string,
		newPass: string
	): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const path = this.getFilePathForAddress(address);
			let account: Account;

			try {
				account = Wallet.decrypt(
					JSONBig.parse(fs.readFileSync(path, 'utf8')),
					old
				);
			} catch (e) {
				reject('Decryption with password provided failed!');
				return;
			}

			const accountNew = account.encrypt(newPass);
			const string = JSONBig.stringify(accountNew);

			fs.writeFileSync(path, string);

			resolve(string);
		});
	}

	public list(
		fetch: boolean = false,
		connection?: EVMLC
	): Promise<BaseAccount[]> {
		return new Promise<BaseAccount[]>(async resolve => {
			const accounts: BaseAccount[] = [];
			const files = this.allKeystoreFiles();
			if (files.length) {
				for (const file of files) {
					const address = file.address;
					if (fetch && connection) {
						accounts.push(
							await this.fetchBalanceAndNonce(address, connection)
						);
					} else {
						accounts.push({
							address,
							balance: 0,
							nonce: 0
						});
					}
				}
				resolve(accounts);
			} else {
				resolve(accounts);
			}
		});
	}

	public get(address: string): Promise<V3JSONKeyStore> {
		return new Promise<V3JSONKeyStore>(resolve => {
			resolve(this.getKeystoreFile(address));
		});
	}

	public fetchBalanceAndNonce(
		address: string,
		connection: EVMLC
	): Promise<BaseAccount> {
		return new Promise<BaseAccount>(async resolve => {
			const account = await connection.getAccount(address);

			if (account) {
				resolve(account);
			}
		});
	}

	private getFilePathForAddress(address: string): string {
		const dir = fs.readdirSync(this.path).filter(file => {
			return !file.startsWith('.');
		});

		if (address.startsWith('0x')) {
			address = address.substr(2);
		}
		address = address.toLowerCase();

		for (const filename of dir) {
			const filepath = path.join(this.path, filename);
			const account: BaseAccount = JSONBig.parse(
				fs.readFileSync(filepath, 'utf8')
			);
			if (account.address === address) {
				return filepath;
			}
		}

		return '';
	}

	private allKeystoreFiles() {
		const json = [];
		const files = fs.readdirSync(this.path).filter(file => {
			return !file.startsWith('.');
		});

		for (const file of files) {
			const filepath = path.join(this.path, file);
			const data = fs.readFileSync(filepath, 'utf8');

			json.push(JSONBig.parse(data));
		}

		return json;
	}

	private getKeystoreFile(address: string): V3JSONKeyStore {
		if (address.startsWith('0x')) {
			address = address.substr(2);
		}
		address = address.toLowerCase();
		return (
			this.allKeystoreFiles().filter(
				file => file.address === address
			)[0] || null
		);
	}
}
