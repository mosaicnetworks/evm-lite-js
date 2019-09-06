import * as nodepath from 'path';

import utils from 'evm-lite-utils';

import {
	AbstractKeystore,
	IMonikerKeystore,
	IV3Keyfile
} from 'evm-lite-keystore';

import Configuration, { IConfiguration } from './Configuration';

export default class DataDirectory<K extends AbstractKeystore> {
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

	public get config(): IConfiguration {
		return this.configuration.state;
	}

	public get configToml(): string {
		return this.configuration.toTOML();
	}

	public async readConfig(): Promise<IConfiguration> {
		return await this.configuration.load();
	}

	public async saveConfig(schema: IConfiguration): Promise<void> {
		return await this.configuration.save(schema);
	}

	public async newKeyfile(
		moniker: string,
		passphrase: string,
		path?: string
	): Promise<IV3Keyfile> {
		if (!this.keystore) {
			throw new Error('No keystore attached');
		}

		return await this.keystore.create(moniker, passphrase, path);
	}

	public async getKeyfile(moniker: string): Promise<IV3Keyfile> {
		if (!this.keystore) {
			throw new Error('No keystore attached');
		}

		return await this.keystore.get(moniker);
	}

	public async listKeyfiles(): Promise<IMonikerKeystore> {
		if (!this.keystore) {
			throw new Error('No keystore attached');
		}

		return await this.keystore.list();
	}

	public async updateKeyfile(
		moniker: string,
		oldpass: string,
		newpass: string
	): Promise<IV3Keyfile> {
		if (!this.keystore) {
			throw new Error('No keystore attached');
		}

		return await this.keystore.update(moniker, oldpass, newpass);
	}

	public async importKeyfile(
		moniker: string,
		keyfile: IV3Keyfile
	): Promise<IV3Keyfile> {
		if (!this.keystore) {
			throw new Error('No keystore attached');
		}

		return await this.keystore.import(moniker, keyfile);
	}
}
