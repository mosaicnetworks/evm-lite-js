"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var mk = require("mkdirp");
var path = require("path");
var toml = require("toml");
var tomlify = require("tomlify-j0.4");
var Directory_1 = require("./Directory");
var Keystore_1 = require("./Keystore");
var Config = /** @class */ (function () {
    function Config(datadir, filename) {
        this.datadir = datadir;
        this.filename = filename;
        this.data = Config.default(this.datadir);
        this.initialData = Config.default(this.datadir);
        this.path = path.join(datadir, filename);
        if (Directory_1.default.exists(this.path)) {
            var tomlData = fs.readFileSync(this.path, 'utf8');
            this.data = toml.parse(tomlData);
            this.initialData = toml.parse(tomlData);
        }
    }
    Config.default = function (datadir) {
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
    };
    Config.defaultTOML = function (datadir) {
        return tomlify.toToml(Config.default(datadir), { spaces: 2 });
    };
    Config.prototype.toTOML = function () {
        return tomlify.toToml(this.data, { spaces: 2 });
    };
    Config.prototype.read = function () {
        var _this = this;
        if (Directory_1.default.exists(this.path)) {
            return new Promise(function (resolve, reject) {
                fs.readFile(_this.path, function (err, data) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(toml.parse(data.toString()));
                });
            });
        }
    };
    Config.prototype.write = function (data) {
        var _this = this;
        if (Directory_1.default.exists(this.path)) {
            return new Promise(function (resolve, reject) {
                fs.writeFile(_this.path, tomlify.toToml(data), function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        }
    };
    Config.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        if (Directory_1.default.isEquivalentObjects(_this.data, _this.initialData)) {
                            resolve(false);
                        }
                        else {
                            var list = _this.path.split('/');
                            list.pop();
                            var configFileDir = list.join('/');
                            if (!Directory_1.default.exists(configFileDir)) {
                                mk.sync(configFileDir);
                            }
                            fs.writeFile(_this.path, _this.toTOML(), function (err) {
                                if (!err) {
                                    _this.initialData = toml.parse(_this.toTOML());
                                }
                                resolve(!err);
                            });
                        }
                    })];
            });
        });
    };
    Config.prototype.getOrCreateKeystore = function () {
        Directory_1.default.createDirectoryIfNotExists(this.data.defaults.keystore);
        return new Keystore_1.default(this.data.defaults.keystore);
    };
    return Config;
}());
exports.default = Config;
