"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const DataDirectory_1 = require("./DataDirectory");
class Log {
    constructor(path) {
        this.path = path;
        DataDirectory_1.default.createOrReadFile(this.path, '');
        this.log = ``;
        this.command = ``;
    }
    withCommand(command) {
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        this.log += `[${date} ${time}] `;
        this.log += command;
        this.command = command;
        return this;
    }
    append(keyword, description) {
        this._append(`${keyword}: ${description}`);
        return this;
    }
    show() {
        console.log(this.log);
    }
    write() {
        const previous = fs.readFileSync(this.path, 'utf8') + '\n';
        fs.writeFileSync(this.path, previous + this.log);
        return this;
    }
    _append(text) {
        this.log += `\n${text}`;
    }
}
exports.default = Log;
