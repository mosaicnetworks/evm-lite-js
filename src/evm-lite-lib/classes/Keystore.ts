import * as fs from 'fs';
import * as JSONBig from 'json-bigint';
import * as path from 'path';

import {
	Account,
	Accounts,
	BaseAccount,
	EVMLC,
	V3JSONKeyStore
} from 'evm-lite-core';

import Static from './Static';

export default class Keystore {
	public readonly accounts = new Accounts('127.0.0.1', 8080, {
		from: '0X0000000000000000000000000000000000000000',
		gas: 1000000,
		gasPrice: 0
	});

	constructor(public readonly path: string) {
		Static.createDirectoryIfNotExists(this.path);
	}

	public async decrypt(
		address: string,
		password: string,
		connection?: EVMLC
	): Promise<Account> {
		const keystore = await this.get(address.toLowerCase());
		const decrypted = await this.accounts.decrypt(keystore, password);

		if (connection) {
			const { nonce, balance } = await this.fetchBalanceAndNonce(
				address,
				connection
			);

			decrypted.nonce = nonce;
			decrypted.balance = balance;
		}

		return decrypted;
	}

	public create(password: string, output?: string): Promise<string> {
		return new Promise<string>(resolve => {
			const account = this.accounts.create();
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
				account = this.accounts.decrypt(
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

	public list(connection?: EVMLC): Promise<BaseAccount[]> {
		return new Promise<BaseAccount[]>(async resolve => {
			const accounts: BaseAccount[] = [];
			const files = this.allKeystoreFiles();
			if (files.length) {
				for (const file of files) {
					// @ts-ignore
					const address = file.address;
					if (connection) {
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

	private fetchBalanceAndNonce(
		address: string,
		connection: EVMLC
	): Promise<BaseAccount> {
		return new Promise<BaseAccount>(async resolve => {
			const account = await connection.accounts.getAccount(address);

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
		const json: V3JSONKeyStore[] = [];
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

		// @ts-ignore
		return (
			this.allKeystoreFiles().filter(
				// @ts-ignore
				file => file.address === address
			)[0] || undefined
		);
	}
}
