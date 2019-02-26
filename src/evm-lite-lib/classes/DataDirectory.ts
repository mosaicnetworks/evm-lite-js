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

		this.config = new Config(this.path, 'config.toml');

		const keys = Static.getParentAndName(this.config.data.storage.keystore);

		this.keystore = new Keystore(keys.parent, keys.name);
		this.database = new Database(this.path, 'db.json');
	}

	public newKeystore(dataDirectory: string, name: string): void {
		this.keystore = new Keystore(dataDirectory, name);
	}

	public newConfig(dataDirectory: string, name: string): void {
		this.config = new Config(dataDirectory, name);
	}

	public newDatabase(dataDirectory: string, name: string): void {
		this.database = new Database(dataDirectory, name);
	}
}
