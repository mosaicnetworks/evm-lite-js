import Config from './classes/Config';
import Keystore from './classes/Keystore';
import Database from './database/Database';
export default class DataDirectory {
    readonly path: string;
    config: Config;
    database: Database;
    keystore: Keystore;
    constructor(path: string);
    newKeystore(dataDirectory: string, name: string): void;
    newConfig(dataDirectory: string, name: string): void;
    newDatabase(dataDirectory: string, name: string): void;
}
