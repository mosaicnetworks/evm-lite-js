"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("./Config");
var Directory_1 = require("./Directory");
var Keystore_1 = require("./Keystore");
var DataDirectory = /** @class */ (function () {
    function DataDirectory(path) {
        this.path = path;
        Directory_1.default.createDirectoryIfNotExists(path);
        this.config = new Config_1.default(this.path, 'config.toml');
        this.keystore = new Keystore_1.default(this.path, 'keystore');
    }
    return DataDirectory;
}());
exports.default = DataDirectory;
