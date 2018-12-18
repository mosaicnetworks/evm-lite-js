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
var JSONBig = require("json-bigint");
var path = require("path");
var __1 = require("../..");
var Static_1 = require("./Static");
var Keystore = /** @class */ (function () {
    function Keystore(directory, name) {
        this.directory = directory;
        this.name = name;
        this.path = path.join(directory, name);
        Static_1.default.createDirectoryIfNotExists(this.path);
    }
    Keystore.prototype.create = function (password, output) {
        var _this = this;
        return new Promise(function (resolve) {
            var account = new __1.Account();
            var eAccount = account.encrypt(password);
            var sEAccount = JSONBig.stringify(eAccount);
            var filename = ("UTC--" + JSONBig.stringify(new Date()) + "--" + account.address)
                .replace(/"/g, '')
                .replace(/:/g, '-');
            fs.writeFileSync(path.join(output || _this.path, filename), sEAccount);
            resolve(sEAccount);
        });
    };
    Keystore.prototype.import = function (data) {
        var _this = this;
        return new Promise(function (resolve) {
            var account = JSONBig.parse(data);
            var filename = ("UTC--" + JSONBig.stringify(new Date()) + "--" + account.address)
                .replace(/"/g, '')
                .replace(/:/g, '-');
            fs.writeFileSync(path.join(_this.path, filename), data);
            resolve(account.address);
        });
    };
    Keystore.prototype.update = function (address, old, newPass) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var path = _this.getFilePathForAddress(address);
            var account;
            try {
                account = __1.Account.decrypt(JSONBig.parse(fs.readFileSync(path, 'utf8')), old);
            }
            catch (e) {
                reject('Decryption with password provided failed!');
                return;
            }
            var accountNew = account.encrypt(newPass);
            var string = JSONBig.stringify(accountNew);
            fs.writeFileSync(path, string);
            resolve(string);
        });
    };
    Keystore.prototype.list = function (fetch, connection) {
        var _this = this;
        if (fetch === void 0) { fetch = false; }
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var accounts, files, _i, files_1, file, address, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        accounts = [];
                        files = this.allKeystoreFiles();
                        if (!files.length) return [3 /*break*/, 6];
                        _i = 0, files_1 = files;
                        _c.label = 1;
                    case 1:
                        if (!(_i < files_1.length)) return [3 /*break*/, 5];
                        file = files_1[_i];
                        address = file.address;
                        if (!(fetch && connection)) return [3 /*break*/, 3];
                        _b = (_a = accounts).push;
                        return [4 /*yield*/, this.fetchBalanceAndNonce(address, connection)];
                    case 2:
                        _b.apply(_a, [_c.sent()]);
                        return [3 /*break*/, 4];
                    case 3:
                        accounts.push({
                            address: address,
                            balance: 0,
                            nonce: 0
                        });
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5:
                        resolve(accounts);
                        return [3 /*break*/, 7];
                    case 6:
                        resolve(accounts);
                        _c.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    Keystore.prototype.get = function (address) {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(_this.getKeystoreFile(address));
        });
    };
    Keystore.prototype.fetchBalanceAndNonce = function (address, connection) {
        var _this = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connection.getAccount(address)];
                    case 1:
                        account = _a.sent();
                        if (account) {
                            resolve(account);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Keystore.prototype.getFilePathForAddress = function (address) {
        var dir = fs.readdirSync(this.path).filter(function (file) {
            return !(file.startsWith('.'));
        });
        if (address.startsWith('0x')) {
            address = address.substr(2);
        }
        address = address.toLowerCase();
        for (var _i = 0, dir_1 = dir; _i < dir_1.length; _i++) {
            var filename = dir_1[_i];
            var filepath = path.join(this.path, filename);
            var account = JSONBig.parse(fs.readFileSync(filepath, 'utf8'));
            if (account.address === address) {
                return filepath;
            }
        }
        return '';
    };
    Keystore.prototype.allKeystoreFiles = function () {
        var json = [];
        var files = fs.readdirSync(this.path).filter(function (file) {
            return !(file.startsWith('.'));
        });
        for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
            var file = files_2[_i];
            var filepath = path.join(this.path, file);
            var data = fs.readFileSync(filepath, 'utf8');
            json.push(JSONBig.parse(data));
        }
        return json;
    };
    Keystore.prototype.getKeystoreFile = function (address) {
        if (address.startsWith('0x')) {
            address = address.substr(2);
        }
        address = address.toLowerCase();
        return this.allKeystoreFiles().filter(function (file) { return file.address === address; })[0] || null;
    };
    return Keystore;
}());
exports.default = Keystore;
