import { BaseAccount, EVMLC } from "../..";
export default class Keystore {
    readonly directory: string;
    readonly name: string;
    readonly path: string;
    constructor(directory: string, name: string);
    create(password: string, output?: string): Promise<string>;
    import(data: string): Promise<string>;
    update(address: string, old: string, newPass: string): Promise<string>;
    list(fetch?: boolean, connection?: EVMLC): Promise<BaseAccount[]>;
    get(address: string): Promise<string>;
    private fetchBalanceAndNonce;
    private getFilePathForAddress;
    private allKeystoreFiles;
    private getKeystoreFile;
}
