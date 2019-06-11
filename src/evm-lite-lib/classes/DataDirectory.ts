import * as nodePath from 'path';

import Database from '../database/Database';
import Config from './Config';
import Keystore from './Keystore';
import Static from './Static';

export default class DataDirectory {
	public config: Config;
	public database: Database;
	public keystore: Keystore;

	/**
	 * Data directory controller class
	 *
	 * @description
	 * A data directory is a folder which contains the 'keystore', 'db.json'
	 * and the 'config.toml' file for the client sided tools for EVM-Lite.
	 * The default directory structure is:
	 *
	 * + Data Directory
	 *     + keystore
	 *     - db.json
	 *     - config.toml
	 *
	 * If the directory does not exist it will be created along with all
	 * required files. The keystore directory is relative to the 'config.toml'
	 * file.
	 *
	 * @param path - The relative or absolute path for the data directory.
	 */
	constructor(readonly path: string) {
		Static.createDirectoryIfNotExists(path);

		const configPath = nodePath.join(this.path, 'config.toml');
		const databasePath = nodePath.join(this.path, 'db.json');

		this.config = new Config(configPath);
		this.keystore = new Keystore(this.config.data.storage.keystore);
		this.database = new Database(databasePath);
	}

	public newKeystore(path: string): void {
		this.keystore = new Keystore(path);
	}

	public newConfig(path: string): void {
		this.config = new Config(path);
	}

	public newDatabase(path: string): void {
		this.database = new Database(path);
	}
}
