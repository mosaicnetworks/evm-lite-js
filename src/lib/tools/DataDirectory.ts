import * as fs from "fs";
import * as mkdir from "mkdirp";
import * as path from 'path';

import Config from "./Config";


export default class DataDirectory {

    public static exists(path: string): boolean {
        return fs.existsSync(path);
    }

    public static isDirectory(path: string): boolean {
        return fs.lstatSync(path).isDirectory();
    }

    public static createDirectoryIfNotExists(path: string): void {
        if (!DataDirectory.exists(path)) {
            mkdir.sync(path);
        }
    }

    public static createOrReadFile(path: string, data: string): string {
        if (!DataDirectory.exists(path)) {
            fs.writeFileSync(path, data);

            return data;
        }

        return fs.readFileSync(path, 'utf8');
    }

    public static isEquivalentObjects(objectA: any, objectB: any) {
        const aProps = Object.getOwnPropertyNames(objectA);
        const bProps = Object.getOwnPropertyNames(objectB);

        if (aProps.length !== bProps.length) {
            return false;
        }

        for (let i = 0; i < aProps.length; i++) {
            const propName = aProps[i];

            if (typeof objectA[propName] === 'object' && typeof objectB[propName] === 'object') {
                if (!DataDirectory.isEquivalentObjects(objectA[propName], objectB[propName])) {
                    return false;
                }
            } else if (objectA[propName] !== objectB[propName]) {
                return false;
            }
        }

        return true;
    }

    constructor(readonly path: string) {
        DataDirectory.createDirectoryIfNotExists(path);
    }

    public createAndGetConfig(): Config {
        const configFilePath = path.join(this.path, 'config.toml');

        DataDirectory.createOrReadFile(configFilePath, Config.defaultTOML(this.path));
        return new Config(this.path, 'config.toml');
    }

}