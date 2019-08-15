interface IOptions {
    host: string;
    port: number;
    method: string;
    path: string;
}
export default abstract class AbstractClient {
    readonly host: string;
    readonly port: number;
    protected constructor(host: string, port?: number);
    protected get(path: string): Promise<string>;
    protected post(path: string, data: string): Promise<string>;
    protected options(method: string, path: string): IOptions;
    private request;
}
export {};
