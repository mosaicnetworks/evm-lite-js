import { BaseAccount, Controller, V3JSONKeyStore } from "../../";
export default class Keystore {
    readonly path: string;
    static create(output: string, password: string): string;
    constructor(path: string);
    createWithPromise(password: string): Promise<string>;
    importV3JSONKeystore(data: string): Promise<string>;
    update(address: string, old: string, newPass: string): Promise<void>;
    files(): any[];
    all(fetch?: boolean, connection?: Controller): Promise<any[]>;
    getWithPromise(address: string): Promise<string>;
    get(address: string): V3JSONKeyStore;
    find(address: string): string;
    fetch(address: string, connection: Controller): Promise<BaseAccount>;
}
