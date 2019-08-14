import * as nodepath from 'path';

import utils from 'evm-lite-utils';

import {
	AbstractKeystore,
	IV3Keyfile,
	MonikerKeystore
} from 'evm-lite-keystore';

import Configuration, { ConfigurationSchema } from './Configuration';

export default class DataDirectory<K extends AbstractKeystore> {
	private readonly configuration: Configuration;

	constructor(
		public readonly path: string,
		configName: string,
		private readonly keystore: K
	) {
		utils.createDirectoryIfNotExists(path);

		if (!utils.isDirectory(this.path)) {
			throw new Error('Provided data directory path is not a directory.');
		}

		this.configuration = new Configuration(
			nodepath.join(this.path, `${configName}.toml`)
		);
	}

	public get keystorePath(): string {
		return this.keystore.path;
	}

	public get configPath(): string {
		return this.configuration.path;
	}

	public get config(): ConfigurationSchema {
		return this.configuration.state;
	}

	public async readConfig(): Promise<ConfigurationSchema> {
		return await this.configuration.load();
	}

	public async saveConfig(schema: ConfigurationSchema): Promise<void> {
		return await this.configuration.save(schema);
	}

	public async createKeyfile(
		moniker: string,
		passphrase: string,
		path?: string
	): Promise<IV3Keyfile> {
		return await this.keystore.create(moniker, passphrase, path);
	}

	public async getKeyfile(moniker: string): Promise<IV3Keyfile> {
		return await this.keystore.get(moniker);
	}

	public async listKeyfiles(): Promise<MonikerKeystore> {
		return await this.keystore.list();
	}

	public async importKeyfile(moniker: string, keyfile: IV3Keyfile) {
		return await this.keystore.import(moniker, keyfile);
	}

	// is this method needed ?
	public decryptKeyfile() {
		// pass
	}
}
