import AccountClient from "./AccountClient";
export default abstract class DefaultClient extends AccountClient {
    protected constructor(host: string, port: number);
    testConnection(): Promise<boolean>;
    getInfo(): Promise<Readonly<object>>;
}
