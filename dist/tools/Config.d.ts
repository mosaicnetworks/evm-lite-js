import Keystore from "./Keystore";
export interface ConfigSchema {
    defaults: {
        host: string;
        port: string;
        from: string;
        gas: string;
        gasprice: string;
        keystore: string;
    };
}
export default class Config {
    datadir: string;
    filename: string;
    static default(datadir: string): {
        defaults: {
            from: string;
            gas: number;
            gasprice: number;
            host: string;
            keystore: string;
            port: string;
        };
    };
    static defaultTOML(datadir: string): string;
    data: any;
    path: string;
    private initialData;
    constructor(datadir: string, filename: string);
    toTOML(): string;
    read(): any;
    write(data: any): Promise<void> | undefined;
    save(): Promise<boolean>;
    getOrCreateKeystore(): Keystore;
}
