"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var toml = require("toml");
var tomlify = require("tomlify-j0.4");
var Static_1 = require("./Static");
var Config = /** @class */ (function () {
    function Config(directory, name) {
        this.directory = directory;
        this.name = name;
        this.data = this.default();
        this.path = path.join(directory, name);
        if (Static_1.default.exists(this.path)) {
            var tomlData = fs.readFileSync(this.path, 'utf8');
            this.data = toml.parse(tomlData);
        }
    }
    Config.prototype.defaultTOML = function () {
        return tomlify.toToml(this.default(), { spaces: 2 });
    };
    Config.prototype.default = function () {
        return {
            connection: {
                host: '127.0.0.1',
                port: 8080,
            },
            defaults: {
                from: '',
                gas: 100000,
                gasPrice: 0
            },
            storage: {
                keystore: path.join(this.directory, 'keystore')
            }
        };
    };
    Config.prototype.toTOML = function () {
        return tomlify.toToml(this.data, { spaces: 2 });
    };
    Config.prototype.load = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.readFile(_this.path, function (err, data) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(toml.parse(data.toString()));
            });
        });
    };
    Config.prototype.save = function (data) {
        var _this = this;
        if (!data.defaults.gasPrice) {
            data.defaults.gasPrice = 0;
        }
        return new Promise(function (resolve, reject) {
            if (Static_1.default.isEquivalentObjects(_this.data, data)) {
                resolve('No changes detected to config.');
            }
            else {
                fs.writeFile(_this.path, tomlify.toToml(data, { spaces: 2 }), function (err) {
                    if (err) {
                        reject('Something went wrong writing the configuration.');
                        return;
                    }
                    _this.data = toml.parse(_this.toTOML());
                    resolve('New configuration saved!');
                });
            }
        });
    };
    return Config;
}());
exports.default = Config;
