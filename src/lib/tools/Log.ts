import * as fs from "fs";

import Directory from "./Directory";


export default class Log {

    private command: string;
    private log: string;

    constructor(readonly path: string) {
        Directory.createOrReadFile(this.path, '');

        this.log = ``;
        this.command = ``;
    }

    public withCommand(command: string): this {
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        this.log += `[${date} ${time}] `;
        this.log += command;
        this.command = command;
        return this
    }

    public append(keyword: string, description: string): this {
        this._append(`${keyword}: ${description}`);
        return this;
    }

    public show(): void {
        console.log(this.log);
    }

    public write(): this {
        const previous = fs.readFileSync(this.path, 'utf8') + '\n';
        fs.writeFileSync(this.path, previous + this.log);
        return this;
    }

    private _append(text: string): void {
        this.log += `\n${text}`
    }

}