import Config from "./classes/Config";
import Keystore from "./classes/Keystore";
export default class DataDirectory {
    readonly path: string;
    readonly config: Config;
    readonly keystore: Keystore;
    constructor(path: string);
}
