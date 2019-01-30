import { V3JSONKeyStore } from '../..';
import { Account, BaseAccount, EVMLC } from '../..';
export default class Keystore {
    readonly directory: string;
    readonly name: string;
    readonly path: string;
    constructor(directory: string, name: string);
    decryptAccount(address: string, password: string, connection?: EVMLC): Promise<Account>;
    create(password: string, output?: string): Promise<string>;
    import(data: string): Promise<string>;
    update(address: string, old: string, newPass: string): Promise<string>;
    list(fetch?: boolean, connection?: EVMLC): Promise<BaseAccount[]>;
    get(address: string): Promise<V3JSONKeyStore>;
    fetchBalanceAndNonce(address: string, connection: EVMLC): Promise<BaseAccount>;
    private getFilePathForAddress;
    private allKeystoreFiles;
    private getKeystoreFile;
}
