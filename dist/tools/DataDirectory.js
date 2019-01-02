"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("./classes/Config");
var Keystore_1 = require("./classes/Keystore");
var Static_1 = require("./classes/Static");
var Database_1 = require("./database/Database");
var DataDirectory = /** @class */ (function () {
    function DataDirectory(path) {
        this.path = path;
        Static_1.default.createDirectoryIfNotExists(path);
        this.config = new Config_1.default(this.path, 'config.toml');
        this.keystore = new Keystore_1.default(this.path, 'keystore');
        this.database = new Database_1.default(this.path, 'db.json');
    }
    return DataDirectory;
}());
exports.default = DataDirectory;
