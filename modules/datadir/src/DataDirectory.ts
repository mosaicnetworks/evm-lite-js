import * as nodepath from 'path';

import utils from 'evm-lite-utils';

import {
	AbstractKeystore,
	MonikerKeystore,
	V3Keyfile
} from 'evm-lite-keystore';

import Configuration, { Config } from './Configuration';

export default class DataDirectory<K extends AbstractKeystore> {
	public static decrypt = AbstractKeystore.decrypt;

	private readonly configuration: Configuration;

	constructor(
		public readonly path: string,
		configName: string,
		private readonly keystore?: K
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
		if (!this.keystore) {
			throw new Error('No keystore attached');
		}

		return this.keystore.path;
	}

	public get configPath(): string {
		return this.configuration.path;
	}

	public get config(): Config {
		return this.configuration.state;
	}

	public get configToml(): string {
		return this.configuration.toTOML();
	}

	public async readConfig(): Promise<Config> {
		return await this.configuration.load();
	}

	public async saveConfig(schema: Config): Promise<void> {
		return await this.configuration.save(schema);
	}

	public async newKeyfile(
		moniker: string,
		passphrase: string,
		path?: string
	): Promise<V3Keyfile> {
		if (!this.keystore) {
			throw new Error('No keystore attached');
		}

		return await this.keystore.create(moniker, passphrase, path);
	}

	public async getKeyfile(moniker: string): Promise<V3Keyfile> {
		if (!this.keystore) {
			throw new Error('No keystore attached');
		}

		return await this.keystore.get(moniker);
	}

	public async listKeyfiles(): Promise<MonikerKeystore> {
		if (!this.keystore) {
			throw new Error('No keystore attached');
		}

		return await this.keystore.list();
	}

	public async updateKeyfile(
		moniker: string,
		oldpass: string,
		newpass: string
	): Promise<V3Keyfile> {
		if (!this.keystore) {
			throw new Error('No keystore attached');
		}

		return await this.keystore.update(moniker, oldpass, newpass);
	}

	public async importKeyfile(
		moniker: string,
		keyfile: V3Keyfile
	): Promise<V3Keyfile> {
		if (!this.keystore) {
			throw new Error('No keystore attached');
		}

		return await this.keystore.import(moniker, keyfile);
	}
}
