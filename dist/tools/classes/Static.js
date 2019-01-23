"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var mkdir = require("mkdirp");
var Static = /** @class */ (function () {
    function Static() {
    }
    Static.exists = function (path) {
        return fs.existsSync(path);
    };
    Static.isDirectory = function (path) {
        return fs.lstatSync(path).isDirectory();
    };
    Static.createDirectoryIfNotExists = function (path) {
        if (!Static.exists(path)) {
            mkdir.sync(path);
        }
    };
    Static.cleanAddress = function (address) {
        address = address.toLocaleLowerCase();
        if (!address.startsWith('0x')) {
            return '0x' + address;
        }
        return address;
    };
    Static.createOrReadFile = function (path, data) {
        if (!Static.exists(path)) {
            fs.writeFileSync(path, data);
            return data;
        }
        return fs.readFileSync(path, 'utf8');
    };
    Static.getParentAndName = function (path) {
        var list = path.split('/');
        var name = list.pop() || 'keystore';
        var parent = list.join('/');
        return {
            parent: parent,
            name: name,
        };
    };
    Static.isEquivalentObjects = function (objectA, objectB) {
        var aProps = Object.getOwnPropertyNames(objectA);
        var bProps = Object.getOwnPropertyNames(objectB);
        if (aProps.length !== bProps.length) {
            return false;
        }
        for (var _i = 0, aProps_1 = aProps; _i < aProps_1.length; _i++) {
            var propName = aProps_1[_i];
            if (typeof objectA[propName] === 'object' && typeof objectB[propName] === 'object') {
                if (!Static.isEquivalentObjects(objectA[propName], objectB[propName])) {
                    return false;
                }
            }
            else if (objectA[propName] !== objectB[propName]) {
                return false;
            }
        }
        return true;
    };
    return Static;
}());
exports.default = Static;
