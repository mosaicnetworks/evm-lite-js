"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("./classes/Config");
var Keystore_1 = require("./classes/Keystore");
var Static_1 = require("./classes/Static");
var Database_1 = require("./database/Database");
var DataDirectory = /** @class */ (function () {
    /**
     * Data directory controller class
     *
     * @description
     * A data directory is a folder which contains the 'keystore', 'db.json' and the 'config.toml' file for the client
     * sided tools for EVM-Lite. The default directory structure is:
     *
     * + Data Directory
     *     + keystore
     *     - db.json
     *     - config.toml
     *
     * If the directory does not exist it will be created along with all required files. The keystore directory is
     * relative to the 'config.toml' file.
     *
     * @param path - The relative or absolute path for the data directory.
     */
    function DataDirectory(path) {
        this.path = path;
        Static_1.default.createDirectoryIfNotExists(path);
        this.config = new Config_1.default(this.path, 'config.toml');
        var keystorePath = this.config.data.storage.keystore;
        var list = keystorePath.split('/');
        var name = list.pop() || 'keystore';
        var keystoreParentDirectory = list.join('/');
        this.keystore = new Keystore_1.default(keystoreParentDirectory, name);
        this.database = new Database_1.default(this.path, 'db.json');
    }
    DataDirectory.prototype.newKeystore = function (dataDirectory, name) {
        this.keystore = new Keystore_1.default(dataDirectory, name);
    };
    DataDirectory.prototype.newConfig = function (dataDirectory, name) {
        this.config = new Config_1.default(dataDirectory, name);
    };
    DataDirectory.prototype.newDatabase = function (dataDirectory, name) {
        this.database = new Database_1.default(dataDirectory, name);
    };
    return DataDirectory;
}());
exports.default = DataDirectory;
