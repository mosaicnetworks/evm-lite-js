import * as fs from 'fs';
import * as JSONBig from 'json-bigint';
import * as nodePath from 'path';

import { Account, BaseAccount, Utils as CoreUtils } from 'evm-lite-core';

import AbstractKeystore, { V3JSONKeyStore } from './AbstractKeystore';
import Utils from './Utils';

export default class Keystore extends AbstractKeystore {
	constructor(public readonly path: string) {
		super();

		Utils.createDirectoryIfNotExists(this.path);

		if (!Utils.isDirectory(path)) {
			throw Error('Path provided for keystore is not a directory.');
		}
	}

	public create(
		password: string,
		overridePath?: string
	): Promise<V3JSONKeyStore> {
		const account = Account.create();
		const keystore = Keystore.encrypt(account, password);
		const filename = `UTC--${JSONBig.stringify(new Date())}--${
			account.address
		}`
			.replace(/"/g, '')
			.replace(/:/g, '-');

		return new Promise<V3JSONKeyStore>((resolve, reject) => {
			fs.writeFile(
				nodePath.join(overridePath || this.path, filename),
				JSON.stringify(keystore),
				err => {
					if (err) {
						reject(err);
					} else {
						resolve(keystore);
					}
				}
			);
		});
	}

	public async list(): Promise<V3JSONKeyStore[]> {
		return new Promise<V3JSONKeyStore[]>((resolve, reject) => {
			const keystores: V3JSONKeyStore[] = [];

			fs.readdir(this.path, (err, list) => {
				if (err) {
					return reject(err);
				}

				for (const file of list.filter(f => {
					return !f.startsWith('.');
				})) {
					const data = fs.readFileSync(
						nodePath.join(this.path, file),
						'utf8'
					);

					try {
						keystores.push(JSONBig.parse(data));
					} catch (e) {
						// pass
					}
				}

				resolve(keystores);
			});
		});
	}

	public async get(address: string): Promise<V3JSONKeyStore> {
		address = CoreUtils.trimHex(address);

		const keystores = await this.list();
		const keystore = keystores.filter(
			store => store.address === address
		)[0];

		if (!keystore) {
			return Promise.reject(
				new Error('Could not locate keystore for given address.')
			);
		}

		return keystore;
	}

	public async update(
		address: string,
		oldPass: string,
		newPass: string
	): Promise<V3JSONKeyStore> {
		const keystore = await this.get(address);

		let account: Account;

		try {
			account = Keystore.decrypt(keystore, oldPass);
		} catch (e) {
			return Promise.reject('Decryption failed.');
		}

		const newKeystore = Keystore.encrypt(account, newPass);
		const path = this.getPath(address);

		fs.writeFileSync(path, JSON.stringify(newKeystore));

		return Promise.resolve(newKeystore);
	}

	public import(keystore: V3JSONKeyStore): Promise<V3JSONKeyStore> {
		throw new Error('Method not implemented.');
	}

	public export(address: string): Promise<V3JSONKeyStore> {
		throw new Error('Method not implemented.');
	}

	private getPath(address: string): string {
		const dir = fs.readdirSync(this.path).filter(file => {
			return !file.startsWith('.');
		});

		if (address.startsWith('0x')) {
			address = address.substr(2);
		}

		address = address.toLowerCase();

		for (const filename of dir) {
			const filepath = nodePath.join(this.path, filename);
			const account: BaseAccount = JSONBig.parse(
				fs.readFileSync(filepath, 'utf8')
			);

			if (account.address === address) {
				return filepath;
			}
		}

		return '';
	}
}
