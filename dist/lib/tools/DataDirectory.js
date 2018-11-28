"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const mkdir = require("mkdirp");
const path = require("path");
const Config_1 = require("./Config");
class DataDirectory {
    constructor(path) {
        this.path = path;
        DataDirectory.createDirectoryIfNotExists(path);
    }
    static exists(path) {
        return fs.existsSync(path);
    }
    static isDirectory(path) {
        return fs.lstatSync(path).isDirectory();
    }
    static createDirectoryIfNotExists(path) {
        if (!DataDirectory.exists(path)) {
            mkdir.sync(path);
        }
    }
    static createOrReadFile(path, data) {
        if (!DataDirectory.exists(path)) {
            fs.writeFileSync(path, data);
            return data;
        }
        return fs.readFileSync(path, 'utf8');
    }
    static isEquivalentObjects(objectA, objectB) {
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
            }
            else if (objectA[propName] !== objectB[propName]) {
                return false;
            }
        }
        return true;
    }
    createAndGetConfig() {
        const configFilePath = path.join(this.path, 'config.toml');
        DataDirectory.createOrReadFile(configFilePath, Config_1.default.defaultTOML(this.path));
        return new Config_1.default(this.path, 'config.toml');
    }
}
exports.default = DataDirectory;
