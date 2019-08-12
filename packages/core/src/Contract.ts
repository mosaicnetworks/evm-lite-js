// @ts-ignore
import coder from 'web3/lib/solidity/coder';
// @ts-ignore
import SolidityEvent from 'web3/lib/web3/event.js';

import { ILog } from './client/BaseEVMLC';

import Function from './contract/Function';
import Transaction, { TX } from './Transaction';
import EVMTypes from './misc/types';

export interface Input {
	readonly name: string;
	readonly type: string;
}

export interface ABI {
	readonly constant?: any;
	readonly inputs: Input[];
	readonly name: string;
	readonly outputs?: any[];
	readonly payable: any;
	readonly stateMutability: any;
	readonly type: any;
}

export type ContractABI = ABI[];

export interface AbstractSchema {
	[key: string]: (tx: TX, ...args: any[]) => Transaction;
}

export default class Contract<Schema extends AbstractSchema> {
	/**
	 * Create a `Contract` object for a contract that has already
	 * been deployed to the network.
	 *
	 * @param abi - The application binary interface of the contract
	 * @param address - The address of the contract
	 *
	 * @returns A contract abstraction object to be used for interacting with
	 * the contract
	 */
	public static load<S extends AbstractSchema>(
		abi: ContractABI,
		address: EVMTypes.Address
	): Contract<S> {
		return new Contract(abi, address);
	}

	/**
	 * Create a `Contract` object for a contract that is yet to be
	 * deployed to a network.
	 *
	 * @param abi - The application binary interface of the contract
	 * @param bytecode - The compiled bytecode of the contract
	 *
	 * @returns A contract abstraction object to be used for interacting with
	 * the contract
	 */
	public static create<S extends AbstractSchema>(
		abi: ContractABI,
		bytcode: string
	): Contract<S> {
		return new Contract(abi, '', bytcode);
	}

	public methods: Schema = {} as Schema;

	constructor(
		public readonly abi: ContractABI,
		public address?: EVMTypes.Address,
		public readonly bytcode?: string
	) {
		if (this.address) {
			this.attachMethodsToContract();
		}
	}

	/**
	 * Generates a transaction that represets the deployment of a contract
	 * to the network.
	 *
	 * @param parameters - The constructor parameters for contract
	 * @param from - The `from` address to deploy the contract with
	 * @param gas - The max `gas` to use for deployment
	 * @param gasPrice - The `gasPrice`for the transaction
	 *
	 * @returns The transaction object represeting deployment
	 */
	public deployTransaction(
		parameters: any[],
		from: EVMTypes.Address,
		gas: EVMTypes.Gas,
		gasPrice: EVMTypes.GasPrice
	): Transaction {
		if (this.address) {
			throw Error('Contract address is set and cannot be deployed.');
		}

		if (!this.bytcode) {
			throw Error('No bytecode set for contract to be deployed.');
		}

		let data = this.bytcode;
		if (parameters.length) {
			data = data + this.encodeConstructorParams(parameters);
		}

		return new Transaction(
			{
				from,
				data,
				gas,
				gasPrice
			},
			false,
			this.parseLogs.bind(this)
		);
	}

	/**
	 * Sets the contract address to be used to any transactions
	 * generated from this object and populates the contract methods
	 * under `.methods`.
	 *
	 * @param address - The address of the contract
	 */
	public setAddressAndAddFunctions(address: string): this {
		this.address = address;
		this.attachMethodsToContract();

		return this;
	}

	private attachMethodsToContract(): void {
		if (!this.address) {
			throw new Error(
				'Cannot attach functions with no contract address set.'
			);
		}

		this.abi
			.filter(json => json.type === 'function')
			.map((funcABI: ABI) => {
				if (!this.address) {
					throw new Error('Cannot attach function');
				}

				const fn = new Function(funcABI, this.address);

				// @ts-ignore
				this.methods[funcABI.name] = fn.generateTransaction.bind(
					fn,
					this.parseLogs.bind(this)
				);
			});
	}

	private encodeConstructorParams(params: any[]): any {
		return (
			this.abi
				.filter(
					json =>
						json.type === 'constructor' &&
						json.inputs.length === params.length
				)
				.map(json => json.inputs.map(input => input.type))
				.map(types => coder.encodeParams(types, params))[0] || ''
		);
	}

	private parseLogs(logs: ILog[]): ILog[] {
		const decoders = this.abi
			.filter(json => json.type === 'event')
			.map(json => new SolidityEvent(null, json, null));

		return logs
			.map((log: ILog) => {
				const decoder = decoders.find(d => {
					return d.signature() === log.topics[0].replace('0x', '');
				});

				if (decoder) {
					return decoder.decode(log);
				} else {
					return log;
				}
			})
			.map((log: ILog) => {
				const abis = this.abi.find(json => {
					return json.type === 'event' && log.event === json.name;
				});

				if (abis && abis.inputs) {
					abis.inputs.forEach((param, i) => {
						if (param.type === 'bytes32') {
							log.args[param.name] = log.args[
								param.name
							].toString();
						}
					});
				}

				return log;
			});
	}
}
