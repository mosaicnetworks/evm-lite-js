// @ts-ignore
import * as coder from 'web3/lib/solidity/coder';
// @ts-ignore
import * as SolidityEvent from 'web3/lib/web3/event.js';

import * as checks from '../../utils/checks';
import * as errors from '../../utils/errors';

import { Log, TXReceipt } from '../../clients/TransactionClient';
import { Address, AddressType, Data, Gas, GasPrice, Nonce } from '../../types';

import AccountClient from '../../clients/AccountClient';

import Account from '../accounts/Account';
import Transaction from '../transaction/Transaction';

import Function from './Function';

interface OverrideContractDeployParameters {
	gas?: Gas;
	gasPrice?: GasPrice;
	data?: Data;
	timeout?: number;
}

export interface ContractOptions {
	gas: Gas;
	gasPrice: GasPrice;
	from: Address;
	address?: Address;
	nonce?: Nonce;
	data?: Data;
	interface: ABI[];
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

export type ContractABI = ABI[];

export interface BaseContractSchema {
	[key: string]: (...args: any[]) => Transaction;
}

export default class Contract<
	ContractFunctionSchema extends BaseContractSchema
> extends AccountClient {
	public methods: ContractFunctionSchema | BaseContractSchema;
	public web3Contract: any;
	public receipt?: TXReceipt;

	constructor(
		public contractOptions: ContractOptions,
		host: string,
		port: number
	) {
		super(host, port);
		this.methods = {};

		if (this.contractOptions.address) {
			this.attachMethodsToContract();
		}
	}

	public async deploy(
		account: Account,
		params?: any[],
		options?: OverrideContractDeployParameters
	): Promise<this> {
		options = { ...options };

		if (this.contractOptions.address) {
			return Promise.reject(errors.ContractAddressFieldSetAndDeployed());
		}

		this.contractOptions.interface.filter((abi: ABI) => {
			if (abi.type === 'constructor' && params) {
				checks.requireArgsLength(abi.inputs.length, params.length);
			}
		});

		if (this.contractOptions.data || options.data) {
			let data = options.data || this.contractOptions.data;

			if (params) {
				data = data + this.encodeConstructorParams(params);
			}

			const { nonce } = await this.getAccount(account.address);
			console.log(nonce);
			const transaction = new Transaction(
				{
					from: this.contractOptions.from,
					data,
					gas: options.gas || this.contractOptions.gas,
					gasPrice: options.gasPrice || this.contractOptions.gasPrice,
					nonce: this.contractOptions.nonce || nonce,
					chainId: 1
				},
				this.host,
				this.port,
				false
			);

			console.log(transaction.parse());

			await transaction.submit(account, {
				timeout: options.timeout
			});

			this.receipt = await transaction.receipt;

			return this.setAddressAndPopulateFunctions(
				this.receipt.contractAddress
			);
		} else {
			return Promise.reject(errors.InvalidDataFieldInOptions());
		}
	}

	public address(address: string): this {
		this.contractOptions.address = new AddressType(address);
		return this;
	}

	public gas(gas: Gas): this {
		this.contractOptions.gas = gas;
		return this;
	}

	public gasPrice(gasPrice: GasPrice): this {
		this.contractOptions.gasPrice = gasPrice;
		return this;
	}

	public data(data: Data): this {
		this.contractOptions.data = data;
		return this;
	}

	public JSONInterface(abis: ABI[]): this {
		this.contractOptions.interface = abis;
		return this;
	}

	public setAddressAndPopulateFunctions(address: string): this {
		this.address(address);
		this.attachMethodsToContract();

		return this;
	}

	public parseLogs(logs: Log[]): Log[] {
		const decoders = this.contractOptions.interface
			.filter(json => {
				return json.type === 'event';
			})
			.map(json => {
				return new SolidityEvent(null, json, null);
			});

		return logs
			.map((log: Log) => {
				const decoder = decoders.find(decoder => {
					return (
						decoder.signature() === log.topics[0].replace('0x', '')
					);
				});

				if (decoder) {
					return decoder.decode(log);
				} else {
					return log;
				}
			})
			.map((log: Log) => {
				const abis = this.contractOptions.interface.find(json => {
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

	private attachMethodsToContract(): void {
		if (!this.contractOptions.address) {
			throw new Error(
				'Cannot attach functions as contract address not set.'
			);
		}

		this.contractOptions.interface
			.filter(json => json.type === 'function')
			.map((funcABI: ABI) => {
				if (!this.contractOptions.address) {
					throw new Error('Cannot attach function');
				}

				const solFunction = new Function(
					funcABI,
					this.contractOptions.address,
					this.host,
					this.port
				);

				this.methods[
					funcABI.name
				] = solFunction.generateTransaction.bind(solFunction, {
					gas: this.contractOptions.gas,
					gasPrice: this.contractOptions.gasPrice,
					from: this.contractOptions.from
				});
			});
	}

	private encodeConstructorParams(params: any[]): any {
		return (
			this.contractOptions.interface
				.filter(
					json =>
						json.type === 'constructor' &&
						json.inputs.length === params.length
				)
				.map(json => json.inputs.map(input => input.type))
				.map(types => coder.encodeParams(types, params))[0] || ''
		);
	}
}
