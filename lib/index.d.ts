declare module 'evm-lite-lib' {
	export { default as EVMLC } from 'evm-lite-lib/evm/EVMLC';
	export { default as Account } from 'evm-lite-lib/evm/classes/Account';
	export { default as Wallet } from 'evm-lite-lib/evm/classes/Wallet';
	export { default as Keystore } from 'evm-lite-lib/tools/classes/Keystore';
	export {
		default as Config,
		ConfigSchema
	} from 'evm-lite-lib/tools/classes/Config';
	export { default as Database } from 'evm-lite-lib/tools/database/Database';
	export {
		BaseContractSchema
	} from 'evm-lite-lib/evm/classes/SolidityContract';
	export { BaseAccount } from 'evm-lite-lib/evm/client/AccountClient';
	export {
		SentTX,
		SignedTransaction,
		default as Transaction
	} from 'evm-lite-lib/evm/classes/Transaction';
	export * from 'evm-lite-lib/evm/utils/Interfaces';
	export { V3JSONKeyStore } from 'evm-lite-lib/evm/classes/Account';
	export { default as DataDirectory } from 'evm-lite-lib/tools/DataDirectory';
	export { default as Static } from 'evm-lite-lib/tools/classes/Static';
	export { TXReceipt } from 'evm-lite-lib/evm/client/TransactionClient';
}

declare module 'evm-lite-lib/evm/EVMLC' {
	import { Gas, GasPrice, Value } from 'evm-lite-lib/evm/types';
	import { ABI } from 'evm-lite-lib/evm/utils/Interfaces';
	import Transaction, { BaseTX } from 'evm-lite-lib/evm/classes/Transaction';
	import SolidityContract, {
		BaseContractSchema
	} from 'evm-lite-lib/evm/classes/SolidityContract';
	import DefaultClient from 'evm-lite-lib/evm/client/DefaultClient';
	interface UserDefinedDefaultTXOptions extends BaseTX {
		from: string;
	}
	export default class EVMLC extends DefaultClient {
		/**
		 * The root controller class to interact with contracts and make transfers.
		 *
		 * @param host - The host address of the node.
		 * @param port - The port of the node.
		 * @param userDefaultTXOptions - The default values for transactions.
		 */
		constructor(
			host: string,
			port: number,
			userDefaultTXOptions: UserDefinedDefaultTXOptions
		);
		/**
		 * Should allow you to set the default `from` to be used for any
		 * transactions created from this object.
		 */
		defaultFrom: string;
		/**
		 * Should allow you to set the default `gas` value to be used for any
		 * transactions created from this object.
		 */
		defaultGas: Gas;
		/**
		 * Should allow you to set the default `gasPrice` to be used for any
		 * transactions created from this object.
		 */
		defaultGasPrice: GasPrice;
		/**
		 * Should generate a contract abstraction class to interact with the
		 * respective contract.
		 *
		 * @description
		 * This function will also fetch the nonce from the node with connection
		 * details specified in the contructor for this class.
		 *
		 * @param abi - The interface of the respective contract.
		 * @param options - (optional) The `data` and `contractAddress` options.
		 */
		loadContract<ContractSchema extends BaseContractSchema>(
			abi: ABI[],
			options?: {
				data?: string;
				contractAddress?: string;
			}
		): Promise<SolidityContract<ContractSchema>>;
		/**
		 * Should prepare a transaction to transfer `value` to the specified `to`
		 * address.
		 *
		 * @description
		 * This function will also fetch the nonce from the node with connection
		 * details specified in the contructor for this class.
		 *
		 * @param to - The address to transfer funds to.
		 * @param value - The amount to transfer.
		 * @param from - (optional) Overrides `from` address set in the constructor.
		 */
		prepareTransfer(
			to: string,
			value: Value,
			from?: string
		): Promise<Transaction>;
	}
	export {};
}

declare module 'evm-lite-lib/evm/classes/Account' {
	import { Account as Web3Account } from 'web3-eth-accounts';
	import { BaseAccount } from 'evm-lite-lib/';
	import Transaction, {
		SignedTransaction,
		TX
	} from 'evm-lite-lib/evm/classes/Transaction';
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
	export default class Account {
		readonly address: string;
		readonly privateKey: string;
		static decrypt(
			v3JSONKeyStore: V3JSONKeyStore,
			password: string
		): Account;
		balance: number;
		nonce: number;
		constructor(data?: Web3Account);
		sign(message: string): any;
		signTransaction(tx: TX | Transaction): Promise<SignedTransaction>;
		encrypt(password: string): V3JSONKeyStore;
		toBaseAccount(): BaseAccount;
	}
}

declare module 'evm-lite-lib/evm/classes/Wallet' {
	import AccountClient from 'evm-lite-lib/evm/client/AccountClient';
	export default class Wallet extends AccountClient {
		constructor(host: string, port: number);
		add(): void;
		remove(): void;
		clear(): void;
		encrypt(): void;
	}
}

declare module 'evm-lite-lib/tools/classes/Keystore' {
	import { V3JSONKeyStore } from 'evm-lite-lib/';
	import { Account, BaseAccount, EVMLC } from 'evm-lite-lib/';
	export default class Keystore {
		readonly directory: string;
		readonly name: string;
		readonly path: string;
		constructor(directory: string, name: string);
		decryptAccount(
			address: string,
			password: string,
			connection?: EVMLC
		): Promise<Account>;
		create(password: string, output?: string): Promise<string>;
		import(data: string): Promise<string>;
		update(address: string, old: string, newPass: string): Promise<string>;
		list(fetch?: boolean, connection?: EVMLC): Promise<BaseAccount[]>;
		get(address: string): Promise<V3JSONKeyStore>;
		fetchBalanceAndNonce(
			address: string,
			connection: EVMLC
		): Promise<BaseAccount>;
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
}

declare module 'evm-lite-lib/tools/database/Database' {
	import { SentTX } from 'evm-lite-lib/';
	import TransactionController from 'evm-lite-lib/tools/database/controllers/Transaction';
	export type TransactionSchema = SentTX;
	export interface DatabaseSchema {
		transactions: TransactionSchema[];
	}
	export default class Database {
		readonly path: string;
		readonly transactions: TransactionController;
		constructor(directory: string, name: string);
	}
}

declare module 'evm-lite-lib/evm/classes/SolidityContract' {
	import { ABI, TXReceipt } from 'evm-lite-lib/';
	import {
		Address,
		Data,
		Gas,
		GasPrice,
		Nonce
	} from 'evm-lite-lib/evm/types';
	import Account from 'evm-lite-lib/evm/classes/Account';
	import Transaction from 'evm-lite-lib/evm/classes/Transaction';
	interface OverrideContractDeployParameters {
		gas?: Gas;
		gasPrice?: GasPrice;
		data?: Data;
	}
	export interface ContractOptions {
		gas: Gas;
		gasPrice: GasPrice;
		from: Address;
		address?: Address;
		nonce: Nonce;
		data?: Data;
		interface: ABI[];
	}
	export interface BaseContractSchema {
		[key: string]: (...args: any[]) => Promise<Transaction>;
	}
	export default class SolidityContract<
		ContractFunctionSchema extends BaseContractSchema
	> {
		options: ContractOptions;
		methods: ContractFunctionSchema | BaseContractSchema;
		web3Contract: any;
		receipt?: TXReceipt;
		constructor(options: ContractOptions, host: string, port: number);
		deploy(
			account: Account,
			params?: any[],
			options?: OverrideContractDeployParameters
		): Promise<this>;
		setAddressAndPopulateFunctions(address: string): this;
		address(address: string): this;
		gas(gas: Gas): this;
		gasPrice(gasPrice: GasPrice): this;
		data(data: Data): this;
		JSONInterface(abis: ABI[]): this;
	}
	export {};
}

declare module 'evm-lite-lib/evm/client/AccountClient' {
	import { Nonce } from 'evm-lite-lib/evm/types';
	import BaseClient from 'evm-lite-lib/evm/client/BaseClient';
	export interface BaseAccount {
		address: string;
		nonce: Nonce;
		balance: any;
	}
	export default class AccountClient extends BaseClient {
		constructor(host: string, port: number);
		getAccount(address: string): Promise<Readonly<BaseAccount>>;
		getAccounts(): Promise<Readonly<BaseAccount[]>>;
	}
}

declare module 'evm-lite-lib/evm/classes/Transaction' {
	import {
		Address,
		ChainID,
		Data,
		Gas,
		GasPrice,
		Nonce,
		Value
	} from 'evm-lite-lib/evm/types';
	import TransactionClient, {
		TXReceipt
	} from 'evm-lite-lib/evm/client/TransactionClient';
	import Account from 'evm-lite-lib/evm/classes/Account';
	export interface CallTXResponse {
		data: string;
	}
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
	export interface ParsedTX extends BaseTX {
		from: string;
		to?: string;
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
		txReceipt?: TXReceipt;
		signedTX?: SignedTransaction;
		hash?: string;
		constructor(
			tx: TX,
			host: string,
			port: number,
			constant: boolean,
			unpackfn?: ((data: string) => any) | undefined
		);
		readonly receipt: Promise<Readonly<TXReceipt>>;
		/**
		 * Send a transaction to a node for a controlled account.
		 *
		 * @param options - Override transactions options
		 *
		 * @deprecated
		 */
		send(options?: OverrideTXOptions): Promise<TXReceipt>;
		/**
		 * Should `send()` or `call()` the transaction or message dependent on
		 * whether the transaction or message mutates the state.
		 *
		 * @param options - (optional) Override transaction options.
		 * @param account - (optional) The account to sign this transaction.
		 */
		submit(
			options?: OverrideTXOptions,
			account?: Account
		): Promise<this | string>;
		sign(account: Account): Promise<this>;
		call(options?: OverrideTXOptions): Promise<string>;
		toJSON(): TX;
		parseToString(): string;
		from(from: string): this;
		nonce(nonce: number): this;
		chainID(chainId: number): this;
		to(to: string): this;
		value(value: Value): this;
		gas(gas: Gas): this;
		gasPrice(gasPrice: GasPrice): this;
		data(data: Data): this;
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
		readonly path: string;
		config: Config;
		database: Database;
		keystore: Keystore;
		/**
		 * Data directory controller class
		 *
		 * @description
		 * A data directory is a folder which contains the 'keystore', 'db.json'
		 * and the 'config.toml' file for the client sided tools for EVM-Lite.
		 * The default directory structure is:
		 *
		 * + Data Directory
		 *     + keystore
		 *     - db.json
		 *     - config.toml
		 *
		 * If the directory does not exist it will be created along with all
		 * required files. The keystore directory is relative to the 'config.toml'
		 * file.
		 *
		 * @param path - The relative or absolute path for the data directory.
		 */
		constructor(path: string);
		newKeystore(dataDirectory: string, name: string): void;
		newConfig(dataDirectory: string, name: string): void;
		newDatabase(dataDirectory: string, name: string): void;
	}
}

declare module 'evm-lite-lib/tools/classes/Static' {
	export default class Static {
		static exists(path: string): boolean;
		static isDirectory(path: string): boolean;
		static createDirectoryIfNotExists(path: string): void;
		static cleanAddress(address: string): string;
		static createOrReadFile(path: string, data: string): string;
		static getParentAndName(
			path: string
		): {
			parent: string;
			name: string;
		};
		static isEquivalentObjects(objectA: any, objectB: any): boolean;
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
	export interface RawTXSubmitResponse {
		txHash: string;
	}
	export interface SendTXResponse {
		txHash: string;
	}
	export default class TransactionClient extends BaseClient {
		constructor(host: string, port: number);
		protected callTX(tx: string): Promise<Readonly<string>>;
		protected sendTX(tx: string): Promise<Readonly<SendTXResponse>>;
		protected sendRaw(tx: string): Promise<Readonly<RawTXSubmitResponse>>;
		protected getReceipt(txHash: string): Promise<Readonly<TXReceipt>>;
	}
}

declare module 'evm-lite-lib/evm/types' {
	import AddressType from 'evm-lite-lib/evm/types/lib/AddressType';
	import ArrayType from 'evm-lite-lib/evm/types/lib/ArrayType';
	import BooleanType from 'evm-lite-lib/evm/types/lib/BooleanType';
	import ByteType from 'evm-lite-lib/evm/types/lib/ByteType';
	import EVMType from 'evm-lite-lib/evm/types/lib/EVMType';
	import StringType from 'evm-lite-lib/evm/types/lib/StringType';
	import { ParsedTX, TX } from 'evm-lite-lib/evm/classes/Transaction';
	export {
		AddressType,
		ArrayType,
		BooleanType,
		ByteType,
		StringType,
		EVMType
	};
	export * from 'evm-lite-lib/evm/types/lib/TransactionTypes';
	export function parseSolidityTypes(
		raw: string
	):
		| AddressType
		| BooleanType
		| ByteType
		| StringType
		| ArrayType<ByteType>
		| undefined;
	export function parseTransaction(tx: TX): ParsedTX;
}

declare module 'evm-lite-lib/evm/client/DefaultClient' {
	import AccountClient from 'evm-lite-lib/evm/client/AccountClient';
	export default abstract class DefaultClient extends AccountClient {
		protected constructor(host: string, port: number);
		testConnection(): Promise<boolean>;
		getInfo(): Promise<Readonly<object>>;
	}
}

declare module 'evm-lite-lib/' {
	export { default as EVMLC } from 'evm-lite-lib/evm/EVMLC';
	export { default as Account } from 'evm-lite-lib/evm/classes/Account';
	export { default as Wallet } from 'evm-lite-lib/evm/classes/Wallet';
	export { default as Keystore } from 'evm-lite-lib/tools/classes/Keystore';
	export {
		default as Config,
		ConfigSchema
	} from 'evm-lite-lib/tools/classes/Config';
	export { default as Database } from 'evm-lite-lib/tools/database/Database';
	export {
		BaseContractSchema
	} from 'evm-lite-lib/evm/classes/SolidityContract';
	export { BaseAccount } from 'evm-lite-lib/evm/client/AccountClient';
	export {
		SentTX,
		SignedTransaction,
		default as Transaction
	} from 'evm-lite-lib/evm/classes/Transaction';
	export * from 'evm-lite-lib/evm/utils/Interfaces';
	export { V3JSONKeyStore } from 'evm-lite-lib/evm/classes/Account';
	export { default as DataDirectory } from 'evm-lite-lib/tools/DataDirectory';
	export { default as Static } from 'evm-lite-lib/tools/classes/Static';
	export { TXReceipt } from 'evm-lite-lib/evm/client/TransactionClient';
}

declare module 'evm-lite-lib/tools/database/controllers/Transaction' {
	import * as LowDB from 'lowdb';
	import {
		DatabaseSchema,
		TransactionSchema
	} from 'evm-lite-lib/tools/database/Database';
	import TransactionFilter from 'evm-lite-lib/tools/database/filters/Transaction';
	import TransactionSchemaClass from 'evm-lite-lib/tools/database/schemas/Transaction';
	export default class Transaction {
		constructor(database: LowDB.LowdbSync<DatabaseSchema>);
		/**
		 * @description Mutates database.
		 */
		insert(tx: TransactionSchema | TransactionSchemaClass): Promise<void>;
		create(tx?: TransactionSchema): TransactionSchemaClass;
		list(): Promise<TransactionSchema[]>;
		filter(): Promise<TransactionFilter>;
		get(hash: string): Promise<TransactionSchema>;
	}
}

declare module 'evm-lite-lib/evm/client/BaseClient' {
	export const request: (
		options: Options,
		tx?: string | undefined
	) => Promise<string>;
	export interface Options {
		host: string;
		port: number;
		method: string;
		path: string;
	}
	export default abstract class BaseClient {
		readonly host: Readonly<string>;
		readonly port: Readonly<number>;
		protected constructor(host: Readonly<string>, port: Readonly<number>);
		protected options(method: string, path: string): Options;
	}
}

declare module 'evm-lite-lib/evm/types/lib/AddressType' {
	import EVMType from 'evm-lite-lib/evm/types/lib/EVMType';
	export default class AddressType extends EVMType {
		readonly value: string;
		constructor(value: string);
	}
}

declare module 'evm-lite-lib/evm/types/lib/ArrayType' {
	import EVMType from 'evm-lite-lib/evm/types/lib/EVMType';
	export default class ArrayType<T extends EVMType> extends EVMType {
		readonly item: T;
		readonly size?: number | undefined;
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
		readonly size: number;
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
	import { TransactionSchema } from 'evm-lite-lib/tools/database/Database';
	import Filter from 'evm-lite-lib/tools/database/abstract/Filter';
	export default class Transactions extends Filter<TransactionSchema> {
		constructor(transactions: TransactionSchema[]);
		sender(address: string): TransactionSchema[];
		receiver(address: string): TransactionSchema[];
	}
}

declare module 'evm-lite-lib/tools/database/schemas/Transaction' {
	import { SentTX } from 'evm-lite-lib/';
	import { Gas, GasPrice, Nonce, Value } from 'evm-lite-lib/evm/types';
	export type TransactionSchema = SentTX;
	export default class Transaction {
		constructor(sentTX?: TransactionSchema);
		readonly raw: TransactionSchema;
		date(value: any): this;
		from(value: string): this;
		gas(value: Gas): this;
		gasPrice(value: GasPrice): this;
		nonce(value: Nonce): this;
		to(value: string): this;
		txHash(value: string): this;
		value(value: Value): this;
	}
}

declare module 'evm-lite-lib/tools/database/abstract/Filter' {
	export default abstract class BaseFilter<Schema> {
		protected readonly objects: Schema[];
		protected constructor(objects: Schema[]);
	}
}
