declare module 'evm-lite-lib' {
    export {default as Controller} from 'evm-lite-lib/lib/Controller';
    export {default as Account} from 'evm-lite-lib/lib/evm/Account';
    export * from 'evm-lite-lib/lib/evm/utils/Interfaces';
    export {default as Config, ConfigSchema} from 'evm-lite-lib/lib/tools/Config';
    export {default as Keystore} from 'evm-lite-lib/lib/tools/Keystore';
    export {default as Database} from 'evm-lite-lib/lib/tools/Database';
    export {default as DataDirectory} from 'evm-lite-lib/lib/tools/DataDirectory';
    export {default as Log} from 'evm-lite-lib/lib/tools/Log';
    export {default as Directory} from 'evm-lite-lib/lib/tools/Directory';
}

declare module 'evm-lite-lib/lib/Controller' {
    import {ABI, BaseTX} from "evm-lite-lib/lib/evm/utils/Interfaces";
    import Account from "evm-lite-lib/lib/evm/Account";
    import Client from "evm-lite-lib/lib/evm/Client";
    import SolidityContract from "evm-lite-lib/lib/evm/SolidityContract";
    import Transaction from "evm-lite-lib/lib/evm/Transaction";

    interface DefaultTXOptions extends BaseTX {
        from?: string;
    }

    export default class Controller {
        readonly host: string;
        readonly port: number;
        accounts: Account[];
        readonly api: Client;
        readonly defaultOptions: DefaultTXOptions;
        defaultFrom: string;
        defaultGas: number;
        defaultGasPrice: number;

        constructor(host: string, port?: number, _defaultTXOptions?: DefaultTXOptions);

        ContractFromSolidityFile(contractName: string, filePath: string): SolidityContract;

        ContractFromABI(abi: ABI[]): SolidityContract;

        transfer(to: string, from: string, value: number): Transaction;
    }
    export {};
}

declare module 'evm-lite-lib/lib/evm/Account' {
    import {BaseAccount, V3JSONKeyStore, Web3Account} from "evm-lite-lib/lib/evm/utils/Interfaces";
    export default class Account {
        readonly sign: (data: string) => any;
        readonly address: string;
        readonly privateKey: string;
        balance: number;
        nonce: number;

        constructor(create?: boolean, aJSON?: Web3Account);

        static create(): Account;

        static decrypt(v3JSONKeyStore: V3JSONKeyStore, password: string): Account;

        signTransaction(tx: any): any;

        encrypt(password: string): V3JSONKeyStore;

        toBaseAccount(): BaseAccount;
    }
}

declare module 'evm-lite-lib/lib/evm/utils/Interfaces' {
    export interface BaseTX {
        gas?: number;
        gasPrice?: number;
    }

    export interface BaseAccount {
        address: string;
        nonce: number;
        balance: any;
    }

    export interface TX extends BaseTX {
        from: string;
        to?: string;
        value?: number;
        data?: string;
    }

    export interface ContractOptions extends BaseTX {
        from?: string;
        address?: string;
        data?: string;
        jsonInterface: ABI[];
    }

    export interface Input {
        name: string;
        type: string;
    }

    export interface ABI {
        constant?: any;
        inputs: Input[];
        name?: any;
        outputs?: any[];
        payable: any;
        stateMutability: any;
        type: any;
    }

    export interface TXReceipt {
        root: string;
        transactionHash: string;
        from: string;
        to?: string;
        gasUsed: number;
        cumulativeGasUsed: number;
        contractAddress: string;
        logs: [];
        logsBloom: string;
        status: number;
    }

    export interface SolidityCompilerOutput {
        contracts: {};
        errors: string[];
        sourceList: string[];
        sources: {};
    }

    export interface Web3Account {
        address: string;
        privateKey: string;
        sign: (data: string) => any;
        encrypt: (password: string) => V3JSONKeyStore;
        signTransaction: (tx: string) => any;
    }

    export interface KDFEncryption {
        ciphertext: string;
        ciperparams: {
            iv: string;
        };
        cipher: string;
        kdf: string;
        kdfparams: {
            dklen: number;
            salt: string;
            n: number;
            r: number;
            p: number;
        };
        mac: string;
    }

    export interface V3JSONKeyStore {
        version: number;
        id: string;
        address: string;
        crypto: KDFEncryption;
    }

    export interface SentTx {
        from: string;
        to: string;
        value: number;
        gas: number;
        nonce: number;
        gasPrice: number;
        date: any;
        txHash: string;
    }
}

declare module 'evm-lite-lib/lib/tools/Config' {
    import Keystore from "evm-lite-lib/lib/tools/Keystore";

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
        data: any;
        path: string;

        constructor(datadir: string, filename: string);

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

        toTOML(): string;

        read(): any;

        write(data: any): Promise<void>;

        save(): Promise<boolean>;

        getOrCreateKeystore(): Keystore;
    }
}

declare module 'evm-lite-lib/lib/tools/Keystore' {
    import {BaseAccount, Controller, V3JSONKeyStore} from "evm-lite-lib/";
    export default class Keystore {
        readonly path: string;

        constructor(path: string);

        static create(output: string, password: string): string;

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
}

declare module 'evm-lite-lib/lib/tools/Database' {
    import {SentTx} from "evm-lite-lib/";
    import Transactions from "evm-lite-lib/lib/tools/Transactions";

    interface Schema {
        transactions: SentTx[];
    }

    export default class Database {
        readonly path: string;
        transactions: Transactions;
        readonly data: Schema;

        constructor(path: string);

        static initial(): {
            transactions: any[];
        };

        save(): Promise<boolean>;
    }
    export {};
}

declare module 'evm-lite-lib/lib/tools/DataDirectory' {
    import Config from "evm-lite-lib/lib/tools/Config";
    import Keystore from "evm-lite-lib/lib/tools/Keystore";
    export default class DataDirectory {
        readonly path: string;
        readonly config: Config;
        readonly keystore: Keystore;

        constructor(path: string);

        createAndGetConfig(): Config;

        createAndGetKeystore(): Keystore;

        checkInitialisation(): Promise<void>;
    }
}

declare module 'evm-lite-lib/lib/tools/Log' {
    export default class Log {
        readonly path: string;

        constructor(path: string);

        withCommand(command: string): this;

        append(keyword: string, description: string): this;

        show(): void;

        write(): this;
    }
}

declare module 'evm-lite-lib/lib/tools/Directory' {
    export default class Directory {
        static exists(path: string): boolean;

        static isDirectory(path: string): boolean;

        static createDirectoryIfNotExists(path: string): void;

        static createOrReadFile(path: string, data: string): string;

        static isEquivalentObjects(objectA: any, objectB: any): boolean;
    }
}

declare module 'evm-lite-lib/lib/evm/Client' {
    import {BaseAccount, TXReceipt} from "evm-lite-lib/lib/evm/utils/Interfaces";
    export default class Client {
        readonly host: string;
        readonly port: number;

        constructor(host: string, port: number);

        getAccount(address: string): Promise<BaseAccount | void>;

        testConnection(): Promise<boolean | null>;

        getAccounts(): Promise<BaseAccount[] | void>;

        getInfo(): Promise<object | null>;

        call(tx: string): Promise<string | void>;

        sendTx(tx: string): Promise<string | void>;

        sendRawTx(tx: string): Promise<string | void>;

        getReceipt(txHash: string): Promise<TXReceipt | null>;
    }
}

declare module 'evm-lite-lib/lib/evm/SolidityContract' {
    import {ABI, ContractOptions, TXReceipt} from "evm-lite-lib/lib/evm/utils/Interfaces";
    import Controller from "evm-lite-lib/lib/Controller";
    export default class SolidityContract {
        options: ContractOptions;
        readonly controller: Controller;
        methods: any;
        web3Contract: any;
        receipt: TXReceipt;

        constructor(options: ContractOptions, controller: Controller);

        deploy(options?: {
            parameters?: any[];
            gas?: number;
            gasPrice?: any;
            data?: string;
        }): any;

        setAddressAndPopulate(address: string): this;

        address(address: string): this;

        gas(gas: number): this;

        gasPrice(gasPrice: number): this;

        data(data: string): this;

        JSONInterface(abis: ABI[]): this;
    }
}

declare module 'evm-lite-lib/lib/evm/Transaction' {
    import {TX, TXReceipt} from "evm-lite-lib/lib/evm/utils/Interfaces";
    import {Controller} from "evm-lite-lib/";
    export default class Transaction {
        readonly constant: boolean;
        readonly unpackfn: (output: string) => any;
        readonly controller: Controller;
        receipt: TXReceipt;

        constructor(_tx: TX, constant: boolean, unpackfn: (output: string) => any, controller: Controller);

        send(options?: {
            to?: string;
            from?: string;
            value?: number;
            gas?: number;
            gasPrice?: number;
        }): any;

        call(options?: {
            to?: string;
            from?: string;
            value?: number;
            gas?: number;
            gasPrice?: number;
        }): Promise<any>;

        toString(): string;

        from(from: string): this;

        to(to: string): this;

        value(value: number): this;

        gas(gas: number): this;

        gasPrice(gasPrice: number): this;

        data(data: string): this;
    }
}

declare module 'evm-lite-lib/' {
    export {default as Controller} from 'evm-lite-lib/lib/Controller';
    export {default as Account} from 'evm-lite-lib/lib/evm/Account';
    export * from 'evm-lite-lib/lib/evm/utils/Interfaces';
    export {default as Config, ConfigSchema} from 'evm-lite-lib/lib/tools/Config';
    export {default as Keystore} from 'evm-lite-lib/lib/tools/Keystore';
    export {default as Database} from 'evm-lite-lib/lib/tools/Database';
    export {default as DataDirectory} from 'evm-lite-lib/lib/tools/DataDirectory';
    export {default as Log} from 'evm-lite-lib/lib/tools/Log';
    export {default as Directory} from 'evm-lite-lib/lib/tools/Directory';
}

declare module 'evm-lite-lib/lib/tools/Transactions' {
    import {SentTx} from "evm-lite-lib/";
    export default class Transactions {
        constructor(dbPath: string, transactions: SentTx[]);

        all(): SentTx[];

        add(tx: any): void;

        get(hash: string): SentTx;

        sort(): void;
    }
}

