import Config from "./classes/Config";
import Keystore from "./classes/Keystore";
import Database from "./database/Database";
export default class DataDirectory {
    readonly path: string;
    readonly config: Config;
    readonly database: Database;
    readonly keystore: Keystore;
    constructor(path: string);
}
