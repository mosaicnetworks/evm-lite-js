import * as nodepath from 'path';

import utils from 'evm-lite-utils';

import { AbstractKeystore } from 'evm-lite-keystore';

import Configuration from './Configuration';

export default class DataDirectory<K extends AbstractKeystore> {
	public readonly config: Configuration;

	public keystore?: K;

	constructor(public readonly path: string, configName: string) {
		utils.createDirectoryIfNotExists(path);

		if (!utils.isDirectory(this.path)) {
			throw new Error('Provided data directory path is not a directory.');
		}

		this.config = new Configuration(
			nodepath.join(this.path, `${configName}.toml`)
		);
	}

	public setKeystore(keystore: K): this {
		this.keystore = keystore;

		return this;
	}

	public setConfigFileName() {
		// pass
	}
}
