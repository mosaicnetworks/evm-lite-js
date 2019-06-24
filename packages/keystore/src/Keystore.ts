import * as fs from 'fs';
import * as JSONBig from 'json-bigint';
import * as nodePath from 'path';

import { Account } from 'evm-lite-core';

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

					keystores.push(JSONBig.parse(data));
				}

				resolve(keystores);
			});
		});
	}

	public async get(address: string): Promise<V3JSONKeyStore> {
		if (address.startsWith('0x')) {
			address = address.substr(2);
		}

		address = address.toLowerCase();

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

	public update(
		address: string,
		oldPass: string,
		newPass: string
	): Promise<V3JSONKeyStore> {
		throw new Error('Method not implemented.');
	}

	public import(keystore: V3JSONKeyStore): Promise<V3JSONKeyStore> {
		throw new Error('Method not implemented.');
	}

	public export(address: string): Promise<V3JSONKeyStore> {
		throw new Error('Method not implemented.');
	}
}
