import Config from "./classes/Config";
import Database from "./classes/database/Database";
import Keystore from "./classes/Keystore";
export default class DataDirectory {
    readonly path: string;
    readonly config: Config;
    readonly database: Database;
    readonly keystore: Keystore;
    constructor(path: string);
}
