export declare const request: (options: any, tx?: string | undefined) => Promise<string>;
export default abstract class BaseClient {
    readonly host: Readonly<string>;
    readonly port: Readonly<number>;
    protected constructor(host: Readonly<string>, port: Readonly<number>);
    protected options(method: string, path: string): {
        host: string;
        port: number;
        method: string;
        path: string;
    };
}
