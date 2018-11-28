import Keystore from "./Keystore";
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
    static defaultTOML(datadir: string): any;
    data: any;
    path: string;
    private initialData;
    constructor(datadir: string, filename: string);
    toTOML(): string;
    read(): any;
    write(data: any): Promise<void>;
    save(): Promise<boolean>;
    getOrCreateKeystore(): Keystore;
}
