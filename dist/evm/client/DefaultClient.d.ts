import { BaseAccount } from "../classes/Account";
import TransactionClient from "./TransactionClient";
export default abstract class DefaultClient extends TransactionClient {
    protected constructor(host: string, port: number);
    getAccount(address: string): Promise<BaseAccount | null>;
    testConnection(): Promise<boolean | null>;
    getAccounts(): Promise<BaseAccount[] | null>;
    getInfo(): Promise<object | null>;
}
