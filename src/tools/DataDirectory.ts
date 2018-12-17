import Config from "./classes/Config";
import Database from "./classes/database/Database";
import Keystore from "./classes/Keystore";
import Static from "./classes/Static";


export default class DataDirectory {

    public readonly config: Config;
    public readonly database: Database;
    public readonly keystore: Keystore;

    constructor(readonly path: string) {
        Static.createDirectoryIfNotExists(path);

        this.config = new Config(this.path, 'config.toml');
        this.keystore = new Keystore(this.path, 'keystore');
        this.database = new Database(this.path, 'db.json');
    }

}