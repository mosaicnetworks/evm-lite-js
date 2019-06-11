import * as nodepath from 'path';

import { AbstractKeystore } from 'evm-lite-keystore';

import Configuration from './Configuration';
import Utils from './Utils';

export default class DataDirectory<K extends AbstractKeystore> {
	public readonly config: Configuration;

	public keystore?: K;

	constructor(public readonly path: string) {
		Utils.createDirectoryIfNotExists(path);

		if (!Utils.isDirectory(this.path)) {
			throw new Error('Provided data directory path is not a directory.');
		}

		this.config = new Configuration(
			nodepath.join(this.path, 'config.toml')
		);
	}

	public setKeystore(keystore: K): this {
		this.keystore = keystore;

		return this;
	}
}
