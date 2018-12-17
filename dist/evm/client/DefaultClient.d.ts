import { BaseAccount } from "../..";
import BaseClient from "./BaseClient";
export default abstract class DefaultClient extends BaseClient {
    protected constructor(host: string, port: number);
    getAccount(address: string): Promise<Readonly<BaseAccount>>;
    testConnection(): Promise<boolean>;
    getAccounts(): Promise<Readonly<BaseAccount[]>>;
    getInfo(): Promise<Readonly<object>>;
}
