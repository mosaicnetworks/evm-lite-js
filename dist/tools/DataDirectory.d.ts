import Config from './classes/Config';
import Keystore from './classes/Keystore';
import Database from './database/Database';
export default class DataDirectory {
    readonly path: string;
    config: Config;
    database: Database;
    keystore: Keystore;
    /**
     * Data directory controller class
     *
     * @description
     * A data directory is a folder which contains the 'keystore', 'db.json' and the 'config.toml' file for the client
     * sided tools for EVM-Lite. The default directory structure is:
     *
     * + Data Directory
     *     + keystore
     *     - db.json
     *     - config.toml
     *
     * If the directory does not exist it will be created along with all required files. The keystore directory is
     * relative to the 'config.toml' file.
     *
     * @param path - The relative or absolute path for the data directory.
     */
    constructor(path: string);
    newKeystore(dataDirectory: string, name: string): void;
    newConfig(dataDirectory: string, name: string): void;
    newDatabase(dataDirectory: string, name: string): void;
}
