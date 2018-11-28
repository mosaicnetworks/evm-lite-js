"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const mkdir = require("mkdirp");
const path = require("path");
const toml = require("toml");
const tomlify = require("tomlify-j0.4");
const DataDirectory_1 = require("./DataDirectory");
const Keystore_1 = require("./Keystore");
class Config {
    constructor(datadir, filename) {
        this.datadir = datadir;
        this.filename = filename;
        this.data = Config.default(this.datadir);
        this.initialData = Config.default(this.datadir);
        this.path = path.join(datadir, filename);
        if (DataDirectory_1.default.exists(this.path)) {
            const tomlData = fs.readFileSync(this.path, 'utf8');
            this.data = toml.parse(tomlData);
            this.initialData = toml.parse(tomlData);
        }
    }
    static default(datadir) {
        return {
            defaults: {
                from: '',
                gas: 100000,
                gasprice: 0,
                host: '127.0.0.1',
                keystore: path.join(datadir, 'keystore'),
                port: '8080',
            }
        };
    }
    static defaultTOML(datadir) {
        return tomlify.toToml(Config.default(datadir), { spaces: 2 });
    }
    toTOML() {
        return tomlify.toToml(this.data, { spaces: 2 });
    }
    read() {
        if (DataDirectory_1.default.exists(this.path)) {
            return new Promise((resolve, reject) => {
                fs.readFile(this.path, (err, data) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(toml.parse(data.toString()));
                });
            });
        }
    }
    write(data) {
        if (DataDirectory_1.default.exists(this.path)) {
            return new Promise((resolve, reject) => {
                fs.writeFile(this.path, tomlify.toToml(data), (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        }
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                if (DataDirectory_1.default.isEquivalentObjects(this.data, this.initialData)) {
                    resolve(false);
                }
                else {
                    const list = this.path.split('/');
                    list.pop();
                    const configFileDir = list.join('/');
                    if (!DataDirectory_1.default.exists(configFileDir)) {
                        mkdir.mkdirp(configFileDir);
                    }
                    fs.writeFile(this.path, this.toTOML(), (err) => {
                        if (!err) {
                            this.initialData = toml.parse(this.toTOML());
                        }
                        resolve(!err);
                    });
                }
            });
        });
    }
    getOrCreateKeystore() {
        DataDirectory_1.default.createDirectoryIfNotExists(this.data.defaults.keystore);
        return new Keystore_1.default(this.data.defaults.keystore);
    }
}
exports.default = Config;
