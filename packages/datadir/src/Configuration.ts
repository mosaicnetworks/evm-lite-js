import * as fs from 'fs';
import * as toml from 'toml';
import * as tomlify from 'tomlify-j0.4';

import Utils from 'evm-lite-utils';

import { EVMTypes } from 'evm-lite-core';

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

		if (Utils.exists(this.path)) {
			const tomlData: string = fs.readFileSync(this.path, 'utf8');

			this.state = toml.parse(tomlData);
		} else {
			fs.writeFileSync(this.path, this.toTOML());
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
		return tomlify.toToml(this.state, {
			spaces: 2,
			replace: (key: string, value: any) => {
				if (key === 'port' || key === 'gas' || key === 'gasPrice') {
					return parseInt(value, 10).toString();
				}

				return false;
			}
		});
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
