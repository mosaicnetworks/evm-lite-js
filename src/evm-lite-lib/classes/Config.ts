import * as fs from 'fs';
import * as path from 'path';
import * as toml from 'toml';
import * as tomlify from 'tomlify-j0.4';

import { Gas, GasPrice } from 'evm-lite-core';

import Static from './Static';

export interface ConfigSchema {
	connection: {
		host: string;
		port: number;
	};
	defaults: {
		from: string;
		gas: Gas;
		gasPrice: GasPrice;
	};
	storage: {
		keystore: string;
	};
}

export default class Config {
	public data: ConfigSchema;

	constructor(public readonly path: string) {
		this.data = this.default();

		if (Static.exists(this.path)) {
			const tomlData: string = fs.readFileSync(this.path, 'utf8');

			this.data = toml.parse(tomlData);
		} else {
			Static.createOrReadFile(this.path, this.defaultTOML());
		}
	}

	public defaultTOML(): string {
		return tomlify.toToml(this.default(), { spaces: 2 });
	}

	public default(): ConfigSchema {
		const list = this.path.split('/');
		list.pop();

		const keystoreParent = list.join('/');

		return {
			connection: {
				host: '127.0.0.1',
				port: 8080
			},
			defaults: {
				from: '',
				gas: 100000,
				gasPrice: 0
			},
			storage: {
				keystore: path.join(keystoreParent, 'keystore')
			}
		};
	}

	public toTOML(): string {
		return tomlify.toToml(this.data, { spaces: 2 });
	}

	public load(): Promise<ConfigSchema> {
		return new Promise<any>((resolve, reject) => {
			fs.readFile(this.path, (err, data) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(toml.parse(data.toString()));
			});
		});
	}

	public save(data: ConfigSchema): Promise<string> {
		if (!data.defaults.gasPrice) {
			data.defaults.gasPrice = 0;
		}

		return new Promise<string>((resolve, reject) => {
			if (Static.isEquivalentObjects(this.data, data)) {
				resolve('No changes detected to config.');
			} else {
				fs.writeFile(
					this.path,
					tomlify.toToml(data, { spaces: 2 }),
					err => {
						if (err) {
							reject('Error writing the configuration.');
							return;
						}

						this.data = data;
						resolve('New configuration saved!');
					}
				);
			}
		});
	}
}
