export declare const request: (options: any, tx?: string | undefined) => Promise<string>;
export default abstract class BaseClient {
    readonly host: string;
    readonly port: number;
    protected constructor(host: string, port: number);
    protected options(method: string, path: string): {
        host: string;
        port: number;
        method: string;
        path: string;
    };
}
