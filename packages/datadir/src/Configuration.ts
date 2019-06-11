import * as fs from 'fs';
import * as toml from 'toml';
import * as tomlify from 'tomlify-j0.4';

import { EVMTypes } from 'evm-lite-core';

import Utils from './Utils';

export interface ConfigurationSchema {
	connection: {
		host: string;
		port: number;
	};
	defaults: {
		from: EVMTypes.Address;
		gas: EVMTypes.Gas;
		gasPrice: EVMTypes.GasPrice;
	};
}

export default class Configuration {
	public state: ConfigurationSchema;

	constructor(public readonly path: string) {
		this.state = this.default();

		Utils.createDirectoryIfNotExists(this.path);

		if (!Utils.isDirectory(this.path)) {
			const tomlData: string = fs.readFileSync(this.path, 'utf8');
			this.state = toml.parse(tomlData);
		} else {
			throw Error('Configuration path provided is a directory.');
		}
	}

	public default(): ConfigurationSchema {
		return {
			connection: {
				host: '127.0.0.1',
				port: 8080
			},
			defaults: {
				from: '',
				gas: 100000,
				gasPrice: 0
			}
		};
	}

	public toTOML(): string {
		return tomlify.toToml(this.state, { spaces: 2 });
	}

	public load(): Promise<ConfigurationSchema> {
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

	public save(data: ConfigurationSchema): Promise<void> {
		if (!data.defaults.gasPrice) {
			data.defaults.gasPrice = 0;
		}

		return new Promise<void>((resolve, reject) => {
			if (Utils.deepEquals(this.state, data)) {
				resolve();
			} else {
				fs.writeFile(
					this.path,
					tomlify.toToml(data, { spaces: 2 }),
					err => {
						if (err) {
							reject(
								new Error('Writing the configuration failed.')
							);
							return;
						}

						this.state = data;
						resolve();
					}
				);
			}
		});
	}
}
