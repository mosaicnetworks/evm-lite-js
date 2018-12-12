import * as path from 'path';

import Config from "./Config";
import Directory from "./Directory";
import Keystore from "./Keystore";


export default class DataDirectory {

    public readonly config: Config;
    public readonly keystore: Keystore;

    constructor(readonly path: string) {
        Directory.createDirectoryIfNotExists(path);

        this.config = this.createAndGetConfig();
        this.keystore = this.createAndGetKeystore();
    }

    public createAndGetConfig(): Config {
        const configFilePath = path.join(this.path, 'config.toml');
        Directory.createOrReadFile(configFilePath, Config.defaultTOML(this.path));
        return new Config(this.path, 'config.toml');
    }

    public createAndGetKeystore(): Keystore {
        const keystoreDirPath = path.join(this.path, 'keystore');
        Directory.createDirectoryIfNotExists(keystoreDirPath);
        return new Keystore(keystoreDirPath)
    }

    public checkInitialisation(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.config && this.keystore) {
                resolve();
            } else {
                reject();
            }
        });
    }

}