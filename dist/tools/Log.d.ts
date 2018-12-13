export default class Log {
    readonly path: string;
    private command;
    private log;
    constructor(path: string);
    withCommand(command: string): this;
    append(keyword: string, description: string): this;
    show(): void;
    write(): this;
    private _append;
}
