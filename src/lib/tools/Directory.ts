import * as fs from "fs";
import * as mkdir from "mkdirp";


export default class Directory {
    public static exists(path: string): boolean {
        return fs.existsSync(path);
    }

    public static isDirectory(path: string): boolean {
        return fs.lstatSync(path).isDirectory();
    }

    public static createDirectoryIfNotExists(path: string): void {
        if (!Directory.exists(path)) {
            mkdir.sync(path);
        }
    }

    public static createOrReadFile(path: string, data: string): string {
        if (!Directory.exists(path)) {
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
                if (!Directory.isEquivalentObjects(objectA[propName], objectB[propName])) {
                    return false;
                }
            } else if (objectA[propName] !== objectB[propName]) {
                return false;
            }
        }

        return true;
    }
}