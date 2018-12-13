"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var Config_1 = require("./Config");
var Directory_1 = require("./Directory");
var Keystore_1 = require("./Keystore");
var DataDirectory = /** @class */ (function () {
    function DataDirectory(path) {
        this.path = path;
        Directory_1.default.createDirectoryIfNotExists(path);
        this.config = this.createAndGetConfig();
        this.keystore = this.createAndGetKeystore();
    }
    DataDirectory.prototype.createAndGetConfig = function () {
        var configFilePath = path.join(this.path, 'config.toml');
        Directory_1.default.createOrReadFile(configFilePath, Config_1.default.defaultTOML(this.path));
        return new Config_1.default(this.path, 'config.toml');
    };
    DataDirectory.prototype.createAndGetKeystore = function () {
        var keystoreDirPath = path.join(this.path, 'keystore');
        Directory_1.default.createDirectoryIfNotExists(keystoreDirPath);
        return new Keystore_1.default(keystoreDirPath);
    };
    DataDirectory.prototype.checkInitialisation = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.config && _this.keystore) {
                resolve();
            }
            else {
                reject();
            }
        });
    };
    return DataDirectory;
}());
exports.default = DataDirectory;
