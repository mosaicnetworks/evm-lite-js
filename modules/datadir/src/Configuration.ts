import * as fs from 'fs';
import * as toml from 'toml';
import * as tomlify from 'tomlify-j0.4';

import { promisify } from 'util';

import utils from 'evm-lite-utils';

// promisify filesystem methods
const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);

export type Config = {
	// node defaults
	connection: {
		host: string;
		port: number;
	};

	// transaction defaults
	defaults: {
		from: string;
		gas: number;
	};
};

export default class Configuration {
	public state: Config;

	constructor(public readonly path: string) {
		this.state = this.default();

		if (utils.exists(this.path)) {
			const tomlData: string = fs.readFileSync(this.path, 'utf8');

			this.state = toml.parse(tomlData);
		} else {
			fs.writeFileSync(this.path, this.toTOML());
		}
	}

	public default(): Config {
		return {
			connection: {
				host: 'localhost',
				port: 8080
			},

			defaults: {
				// default moniker for `from` address
				from: '',
				// default gas 10^6
				gas: 1000000
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

	public async load(): Promise<Config> {
		try {
			const data = await read(this.path, { encoding: 'utf8' });
			const config = toml.parse(data.toString());

			return Promise.resolve(config);
		} catch (e) {
			return Promise.reject(e);
		}
	}

	public async save(data: Config): Promise<void> {
		try {
			if (!utils.deepEquals(this.state, data)) {
				const tomldata = tomlify.toToml(data, { spaces: 2 });

				await write(this.path, tomldata);

				// update current data with newly saved
				this.state = data;

				return Promise.resolve();
			}
		} catch (e) {
			return Promise.reject(e);
		}
	}
}
