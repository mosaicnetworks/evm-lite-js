export declare const request: (options: Options, tx?: string | undefined) => Promise<string>;
export interface Options {
    host: string;
    port: number;
    method: string;
    path: string;
}
export default abstract class BaseClient {
    readonly host: Readonly<string>;
    readonly port: Readonly<number>;
    protected constructor(host: Readonly<string>, port: Readonly<number>);
    protected options(method: string, path: string): Options;
}
