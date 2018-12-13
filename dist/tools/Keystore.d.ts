import { Controller } from "..";
import { BaseAccount } from '../evm/utils/Interfaces';
export default class Keystore {
    readonly path: string;
    constructor(path: string);
    create(password: string, output?: string): Promise<string>;
    import(data: string): Promise<string>;
    update(address: string, old: string, newPass: string): Promise<void>;
    all(fetch?: boolean, connection?: Controller): Promise<any[]>;
    get(address: string): Promise<string>;
    getFilePathForAddress(address: string): string;
    fetch(address: string, connection: Controller): Promise<BaseAccount>;
    private allKeystoreFiles;
    private getKeystoreFile;
}
