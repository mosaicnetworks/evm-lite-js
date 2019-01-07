import Config from './classes/Config';
import Keystore from './classes/Keystore';
import Static from './classes/Static';
import Database from './database/Database';


export default class DataDirectory {

	public config: Config;
	public database: Database;
	public keystore: Keystore;

	constructor(readonly path: string) {
		Static.createDirectoryIfNotExists(path);

		this.config = new Config(this.path, 'config.toml');
		this.keystore = new Keystore(this.path, 'keystore');
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
