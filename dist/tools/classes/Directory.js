"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var mkdir = require("mkdirp");
var Directory = /** @class */ (function () {
    function Directory() {
    }
    Directory.exists = function (path) {
        return fs.existsSync(path);
    };
    Directory.isDirectory = function (path) {
        return fs.lstatSync(path).isDirectory();
    };
    Directory.createDirectoryIfNotExists = function (path) {
        if (!Directory.exists(path)) {
            mkdir.sync(path);
        }
    };
    Directory.createOrReadFile = function (path, data) {
        if (!Directory.exists(path)) {
            fs.writeFileSync(path, data);
            return data;
        }
        return fs.readFileSync(path, 'utf8');
    };
    Directory.isEquivalentObjects = function (objectA, objectB) {
        var aProps = Object.getOwnPropertyNames(objectA);
        var bProps = Object.getOwnPropertyNames(objectB);
        if (aProps.length !== bProps.length) {
            return false;
        }
        for (var _i = 0, aProps_1 = aProps; _i < aProps_1.length; _i++) {
            var propName = aProps_1[_i];
            if (typeof objectA[propName] === 'object' && typeof objectB[propName] === 'object') {
                if (!Directory.isEquivalentObjects(objectA[propName], objectB[propName])) {
                    return false;
                }
            }
            else if (objectA[propName] !== objectB[propName]) {
                return false;
            }
        }
        return true;
    };
    return Directory;
}());
exports.default = Directory;
