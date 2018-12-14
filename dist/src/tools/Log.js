"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Directory_1 = require("./Directory");
var Log = /** @class */ (function () {
    function Log(path) {
        this.path = path;
        Directory_1.default.createOrReadFile(this.path, '');
        this.log = "";
        this.command = "";
    }
    Log.prototype.withCommand = function (command) {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        this.log += "[" + date + " " + time + "] ";
        this.log += command;
        this.command = command;
        return this;
    };
    Log.prototype.append = function (keyword, description) {
        this._append(keyword + ": " + description);
        return this;
    };
    Log.prototype.show = function () {
        console.log(this.log);
    };
    Log.prototype.write = function () {
        var previous = fs.readFileSync(this.path, 'utf8') + '\n';
        fs.writeFileSync(this.path, previous + this.log);
        return this;
    };
    Log.prototype._append = function (text) {
        this.log += "\n" + text;
    };
    return Log;
}());
exports.default = Log;
