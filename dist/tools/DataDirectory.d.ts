import Config from "./Config";
import Keystore from "./Keystore";
export default class DataDirectory {
    readonly path: string;
    readonly config: Config;
    readonly keystore: Keystore;
    constructor(path: string);
    createAndGetConfig(): Config;
    createAndGetKeystore(): Keystore;
    checkInitialisation(): Promise<void>;
}
