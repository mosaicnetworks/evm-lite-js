declare module 'evm-lite-lib' {
	export { default as EVMLC } from 'evm-lite-lib/evm/EVMLC';
	export { default as Account } from 'evm-lite-lib/evm/classes/Account';
	export { default as Keystore } from 'evm-lite-lib/tools/classes/Keystore';
	export { default as Config, ConfigSchema } from 'evm-lite-lib/tools/classes/Config';
	export { default as Database } from 'evm-lite-lib/tools/database/Database';
	export { BaseContractFunctionSchema } from 'evm-lite-lib/evm/classes/SolidityContract';
	export { BaseAccount } from 'evm-lite-lib/evm/client/AccountClient';
	export { SentTX, SignedTransaction, default as Transaction } from 'evm-lite-lib/evm/classes/Transaction';
	export * from 'evm-lite-lib/evm/utils/Interfaces';
	export { V3JSONKeyStore } from 'web3-eth-accounts';
	export { default as DataDirectory } from 'evm-lite-lib/tools/DataDirectory';
	export { default as Static } from 'evm-lite-lib/tools/classes/Static';
	export { TXReceipt } from 'evm-lite-lib/evm/client/TransactionClient';
}

declare module 'evm-lite-lib/evm/EVMLC' {
	import SolidityContract, { BaseContractFunctionSchema } from 'evm-lite-lib/evm/classes/SolidityContract';
	import Transaction, { BaseTX } from 'evm-lite-lib/evm/classes/Transaction';
	import DefaultClient from 'evm-lite-lib/evm/client/DefaultClient';
	import { Gas, GasPrice, Value } from 'evm-lite-lib/evm/types';
	import { ABI } from 'evm-lite-lib/evm/utils/Interfaces';

	interface UserDefinedDefaultTXOptions extends BaseTX {
		from: string;
	}

	export default class EVMLC extends DefaultClient {
		public readonly defaultOptions: UserDefinedDefaultTXOptions;
		public defaultFrom: string;
		public defaultGas: Gas;
		public defaultGasPrice: GasPrice;

		constructor(host: string, port: number, userDefaultTXOptions: UserDefinedDefaultTXOptions);

		public generateContractFromABI<ContractSchema extends BaseContractFunctionSchema>(abi: ABI[]): Promise<SolidityContract<ContractSchema>>;

		public prepareTransfer(to: string, value: Value, from?: string): Promise<Transaction>;
	}
	export {};
}

declare module 'evm-lite-lib/evm/classes/Account' {
	import { BaseAccount } from 'evm-lite-lib/';
	import Transaction, { SignedTransaction, TX } from 'evm-lite-lib/evm/classes/Transaction';
	import { Account as Web3Account, V3JSONKeyStore } from 'web3-eth-accounts';
	export default class Account {

		public static decrypt(v3JSONKeyStore: V3JSONKeyStore, password: string): Account;

		public readonly address: string;
		public readonly privateKey: string;
		public balance: number;
		public nonce: number;

		constructor(data?: Web3Account);

		public sign(message: string): any;

		public signTransaction(tx: TX | Transaction): Promise<SignedTransaction>;

		public encrypt(password: string): V3JSONKeyStore;

		public toBaseAccount(): BaseAccount;
	}
}

declare module 'evm-lite-lib/tools/classes/Keystore' {
	import { BaseAccount, EVMLC } from 'evm-lite-lib/';
	import { V3JSONKeyStore } from 'web3-eth-accounts';
	export default class Keystore {
		public readonly directory: string;
		public readonly name: string;
		public readonly path: string;

		constructor(directory: string, name: string);

		public create(password: string, output?: string): Promise<string>;

		public import(data: string): Promise<string>;

		public update(address: string, old: string, newPass: string): Promise<string>;

		public list(fetch?: boolean, connection?: EVMLC): Promise<BaseAccount[]>;

		public get(address: string): Promise<V3JSONKeyStore>;
	}
}

declare module 'evm-lite-lib/tools/classes/Config' {
	import { Gas, GasPrice } from 'evm-lite-lib/evm/types';

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
		public readonly directory: string;
		public readonly name: string;
		public readonly path: string;
		public data: ConfigSchema;

		constructor(directory: string, name: string);

		public defaultTOML(): string;

		public default(): ConfigSchema;

		public toTOML(): string;

		public load(): Promise<ConfigSchema>;

		public save(data: ConfigSchema): Promise<string>;
	}
}

declare module 'evm-lite-lib/tools/database/Database' {
	import { SentTX } from 'evm-lite-lib/';
	import TransactionController from 'evm-lite-lib/tools/database/controllers/Transaction';
	export type TransactionSchema = SentTX;

	export interface DatabaseSchema {
		transactions: TransactionSchema[];
	}

	export default class Database {
		public readonly path: string;
		public readonly transactions: TransactionController;

		constructor(directory: string, name: string);
	}
}

declare module 'evm-lite-lib/evm/classes/SolidityContract' {
	import { ABI, TXReceipt } from 'evm-lite-lib/';
	import Transaction from 'evm-lite-lib/evm/classes/Transaction';
	import { Address, Data, Gas, GasPrice, Nonce } from 'evm-lite-lib/evm/types';

	export interface ContractOptions {
		gas: Gas;
		gasPrice: GasPrice;
		from: Address;
		address?: Address;
		nonce?: Nonce;
		data?: Data;
		jsonInterface: ABI[];
	}

	export interface BaseContractFunctionSchema {
		[key: string]: (...args: any[]) => Transaction;
	}

	export default class SolidityContract<ContractFunctionSchema extends BaseContractFunctionSchema> {
		public options: ContractOptions;
		public methods: ContractFunctionSchema | BaseContractFunctionSchema;
		public web3Contract: any;
		public receipt?: TXReceipt;

		constructor(options: ContractOptions, host: string, port: number);

		public deploy(options?: {
			parameters?: any[];
			gas?: Gas;
			gasPrice?: GasPrice;
			data?: Data;
		}): Transaction;

		public setAddressAndPopulate(address: string): this;

		public address(address: string): this;

		public gas(gas: Gas): this;

		public gasPrice(gasPrice: GasPrice): this;

		public data(data: Data): this;

		public JSONInterface(abis: ABI[]): this;
	}
}

declare module 'evm-lite-lib/evm/client/AccountClient' {
	import BaseClient from 'evm-lite-lib/evm/client/BaseClient';
	import { Nonce } from 'evm-lite-lib/evm/types';

	export interface BaseAccount {
		address: string;
		nonce: Nonce;
		balance: any;
	}

	export default class AccountClient extends BaseClient {
		constructor(host: string, port: number);

		public getAccount(address: string): Promise<Readonly<BaseAccount>>;

		public getAccounts(): Promise<Readonly<BaseAccount[]>>;
	}
}

declare module 'evm-lite-lib/evm/classes/Transaction' {
	import Account from 'evm-lite-lib/evm/classes/Account';
	import TransactionClient, { TXReceipt } from 'evm-lite-lib/evm/client/TransactionClient';
	import { Address, ChainID, Data, Gas, GasPrice, Nonce, Value } from 'evm-lite-lib/evm/types';

	export interface SentTX {
		from: string;
		to: string;
		value: Value;
		gas: Gas;
		nonce: Nonce;
		gasPrice: GasPrice;
		date: any;
		txHash: string;
	}

	export interface BaseTX {
		gas: Gas;
		gasPrice: GasPrice;
		nonce?: Nonce;
		chainId?: ChainID;
	}

	export interface TX extends BaseTX {
		from: Address;
		to?: Address;
		value?: Value;
		data?: Data;
	}

	interface OverrideTXOptions {
		to?: string;
		from?: string;
		value?: Value;
		gas?: Gas;
		gasPrice?: GasPrice;
	}

	export interface SignedTransaction {
		messageHash: string;
		v: string;
		r: string;
		s: string;
		rawTransaction: string;
	}

	export default class Transaction extends TransactionClient {
		public tx: TX;
		public receipt?: TXReceipt;
		public signedTX?: SignedTransaction;

		constructor(tx: TX, host: string, port: number, constant: boolean, unpackfn?: ((data: string) => any) | undefined);

		public send(options?: OverrideTXOptions): Promise<TXReceipt>;

		public sendRawTX(options?: OverrideTXOptions): Promise<TXReceipt>;

		public sign(account: Account): Promise<this>;

		public call(options?: OverrideTXOptions): Promise<string>;

		public toString(): string;

		public from(from: string): this;

		public to(to: string): this;

		public value(value: Value): this;

		public gas(gas: Gas): this;

		public gasPrice(gasPrice: GasPrice): this;

		public data(data: Data): this;
	}
	export {};
}

declare module 'evm-lite-lib/evm/utils/Interfaces' {
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
}

declare module 'evm-lite-lib/tools/DataDirectory' {
	import Config from 'evm-lite-lib/tools/classes/Config';
	import Keystore from 'evm-lite-lib/tools/classes/Keystore';
	import Database from 'evm-lite-lib/tools/database/Database';
	export default class DataDirectory {
		public readonly path: string;
		public config: Config;
		public database: Database;
		public keystore: Keystore;

		constructor(path: string);

		public newKeystore(dataDirectory: string, name: string): void;

		public newConfig(dataDirectory: string, name: string): void;

		public newDatabase(dataDirectory: string, name: string): void;
	}
}

declare module 'evm-lite-lib/tools/classes/Static' {
	export default class Static {
		public static exists(path: string): boolean;

		public static isDirectory(path: string): boolean;

		public static createDirectoryIfNotExists(path: string): void;

		public static cleanAddress(address: string): string;

		public static createOrReadFile(path: string, data: string): string;

		public static isEquivalentObjects(objectA: any, objectB: any): boolean;
	}
}

declare module 'evm-lite-lib/evm/client/TransactionClient' {
	import BaseClient from 'evm-lite-lib/evm/client/BaseClient';

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

	interface SentRawTXResponse {
		txHash: string;
	}

	export default class TransactionClient extends BaseClient {
		constructor(host: string, port: number);

		public callTX(tx: string): Promise<Readonly<string>>;

		public sendTX(tx: string): Promise<Readonly<string>>;

		public sendRaw(tx: string): Promise<SentRawTXResponse>;

		public getReceipt(txHash: string): Promise<Readonly<TXReceipt>>;
	}
	export {};
}

declare module 'evm-lite-lib/evm/types' {
	import { TX } from 'evm-lite-lib/evm/classes/Transaction';
	import AddressType from 'evm-lite-lib/evm/types/lib/AddressType';
	import ArrayType from 'evm-lite-lib/evm/types/lib/ArrayType';
	import BooleanType from 'evm-lite-lib/evm/types/lib/BooleanType';
	import ByteType from 'evm-lite-lib/evm/types/lib/ByteType';
	import EVMType from 'evm-lite-lib/evm/types/lib/EVMType';
	import StringType from 'evm-lite-lib/evm/types/lib/StringType';
	export { AddressType, ArrayType, BooleanType, ByteType, StringType, EVMType };
	export * from 'evm-lite-lib/evm/types/lib/TransactionTypes';

	export function parseSolidityTypes(raw: string): AddressType | BooleanType | ByteType | StringType | ArrayType<ByteType> | undefined;

	export function parseTransaction(tx: TX): {
		from: string;
		to: string | undefined;
		value?: number | undefined;
		data?: string | undefined;
		gas: number;
		gasPrice: number;
		nonce?: number | undefined;
		chainId?: number | undefined;
	};
}

declare module 'evm-lite-lib/evm/client/DefaultClient' {
	import AccountClient from 'evm-lite-lib/evm/client/AccountClient';
	export default abstract class DefaultClient extends AccountClient {
		protected constructor(host: string, port: number);

		public testConnection(): Promise<boolean>;

		public getInfo(): Promise<Readonly<object>>;
	}
}

declare module 'evm-lite-lib/' {
	export { default as EVMLC } from 'evm-lite-lib/evm/EVMLC';
	export { default as Account } from 'evm-lite-lib/evm/classes/Account';
	export { default as Keystore } from 'evm-lite-lib/tools/classes/Keystore';
	export { default as Config, ConfigSchema } from 'evm-lite-lib/tools/classes/Config';
	export { default as Database } from 'evm-lite-lib/tools/database/Database';
	export { BaseContractFunctionSchema } from 'evm-lite-lib/evm/classes/SolidityContract';
	export { BaseAccount } from 'evm-lite-lib/evm/client/AccountClient';
	export { SentTX, SignedTransaction, default as Transaction } from 'evm-lite-lib/evm/classes/Transaction';
	export * from 'evm-lite-lib/evm/utils/Interfaces';
	export { V3JSONKeyStore } from 'web3-eth-accounts';
	export { default as DataDirectory } from 'evm-lite-lib/tools/DataDirectory';
	export { default as Static } from 'evm-lite-lib/tools/classes/Static';
	export { TXReceipt } from 'evm-lite-lib/evm/client/TransactionClient';
}

declare module 'evm-lite-lib/tools/database/controllers/Transaction' {
	import { DatabaseSchema, TransactionSchema } from 'evm-lite-lib/tools/database/Database';
	import TransactionFilter from 'evm-lite-lib/tools/database/filters/Transaction';
	import TransactionSchemaClass from 'evm-lite-lib/tools/database/schemas/Transaction';
	import * as LowDB from 'lowdb';
	export default class Transaction {
		constructor(database: LowDB.LowdbSync<DatabaseSchema>);

		/**
		 * @description Mutates database.
		 */
		public insert(tx: TransactionSchema | TransactionSchemaClass): Promise<void>;

		public create(tx?: TransactionSchema): TransactionSchemaClass;

		public list(): Promise<TransactionSchema[]>;

		public filter(): Promise<TransactionFilter>;

		public get(hash: string): Promise<TransactionSchema>;
	}
}

declare module 'evm-lite-lib/evm/client/BaseClient' {
	export const request: (options: any, tx?: string | undefined) => Promise<string>;
	export default abstract class BaseClient {
		public readonly host: Readonly<string>;
		public readonly port: Readonly<number>;

		protected constructor(host: Readonly<string>, port: Readonly<number>);

		protected options(method: string, path: string): {
			host: string;
			port: number;
			method: string;
			path: string;
		};
	}
}

declare module 'evm-lite-lib/evm/types/lib/AddressType' {
	import EVMType from 'evm-lite-lib/evm/types/lib/EVMType';
	export default class AddressType extends EVMType {
		public readonly value: string;

		constructor(value: string);
	}
}

declare module 'evm-lite-lib/evm/types/lib/ArrayType' {
	import EVMType from 'evm-lite-lib/evm/types/lib/EVMType';
	export default class ArrayType<T extends EVMType> extends EVMType {
		public readonly item: T;
		public readonly size?: number | undefined;

		constructor(item: T, size?: number | undefined);
	}
}

declare module 'evm-lite-lib/evm/types/lib/BooleanType' {
	import EVMType from 'evm-lite-lib/evm/types/lib/EVMType';
	export default class BooleanType extends EVMType {
		constructor();
	}
}

declare module 'evm-lite-lib/evm/types/lib/ByteType' {
	import EVMType from 'evm-lite-lib/evm/types/lib/EVMType';
	export default class ByteType extends EVMType {
		public readonly size: number;

		constructor();
	}
}

declare module 'evm-lite-lib/evm/types/lib/EVMType' {
	export default abstract class EVMType {
		protected constructor();
	}
}

declare module 'evm-lite-lib/evm/types/lib/StringType' {
	import EVMType from 'evm-lite-lib/evm/types/lib/EVMType';
	export default class StringType extends EVMType {
		constructor();
	}
}

declare module 'evm-lite-lib/evm/types/lib/TransactionTypes' {
	import AddressType from 'evm-lite-lib/evm/types/lib/AddressType';
	export type Gas = number;
	export type GasPrice = number;
	export type Value = number;
	export type Nonce = number;
	export type ChainID = number;
	export type Address = AddressType;
	export type Data = string;
}

declare module 'evm-lite-lib/tools/database/filters/Transaction' {
	import Filter from 'evm-lite-lib/tools/database/abstract/Filter';
	import { TransactionSchema } from 'evm-lite-lib/tools/database/Database';
	export default class Transactions extends Filter<TransactionSchema> {
		constructor(transactions: TransactionSchema[]);

		public sender(address: string): TransactionSchema[];

		public receiver(address: string): TransactionSchema[];
	}
}

declare module 'evm-lite-lib/tools/database/schemas/Transaction' {
	import { SentTX } from 'evm-lite-lib/';
	import { Gas, GasPrice, Nonce, Value } from 'evm-lite-lib/evm/types';
	export default class Transaction {
		public readonly raw: SentTX;

		constructor(sentTX?: SentTX);

		public date(value: any): this;

		public from(value: string): this;

		public gas(value: Gas): this;

		public gasPrice(value: GasPrice): this;

		public nonce(value: Nonce): this;

		public to(value: string): this;

		public txHash(value: string): this;

		public value(value: Value): this;
	}
}

declare module 'evm-lite-lib/tools/database/abstract/Filter' {
	export default abstract class BaseFilter<Schema> {
		protected readonly objects: Schema[];

		protected constructor(objects: Schema[]);
	}
}
