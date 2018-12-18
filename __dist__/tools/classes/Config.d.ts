import { Gas, GasPrice } from "../../evm/types";
export interface ConfigSchema {
    connection: {
        host: string;
        port: number;
    };
    defaults: {
        from: string;
        gas: Gas;
        gasPrice: GasPrice;
    };
    storage: {
        keystore: string;
    };
}
export default class Config {
    readonly directory: string;
    readonly name: string;
    readonly path: string;
    data: ConfigSchema;
    constructor(directory: string, name: string);
    defaultTOML(): string;
    default(): ConfigSchema;
    toTOML(): string;
    load(): Promise<ConfigSchema>;
    save(data: ConfigSchema): Promise<string>;
}
