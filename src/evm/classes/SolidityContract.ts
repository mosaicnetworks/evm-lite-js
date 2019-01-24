// @ts-ignore
import * as coder from 'web3/lib/solidity/coder';

import * as checks from '../utils/checks';
import * as errors from '../utils/errors';

import { ABI, TXReceipt } from '../..';
import { Address, AddressType, Data, Gas, GasPrice, Nonce } from '../types';

import Account from './Account';
import SolidityFunction from './SolidityFunction';
import Transaction from './Transaction';

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
	nonce?: Nonce;
	data?: Data;
	interface: ABI[];
}

export interface BaseContractSchema {
	[key: string]: (...args: any[]) => Promise<Transaction>;
}

export default class SolidityContract<
	ContractFunctionSchema extends BaseContractSchema
> {
	public methods: ContractFunctionSchema | BaseContractSchema;
	public web3Contract: any;
	public receipt?: TXReceipt;

	constructor(
		public options: ContractOptions,
		private host: string,
		private port: number
	) {
		this.methods = {};

		if (this.options.address) {
			this.attachMethodsToContract();
		}
	}

	public async deploy(
		account: Account,
		params?: any[],
		options?: OverrideContractDeployParameters
	): Promise<this> {
		options = { ...options };

		if (this.options.address) {
			throw errors.ContractAddressFieldSetAndDeployed();
		}

		this.options.interface.filter((abi: ABI) => {
			if (abi.type === 'constructor' && params) {
				checks.requireArgsLength(abi.inputs.length, params.length);
			}
		});

		if (this.options.data || options.data) {
			let data = options.data || this.options.data;

			if (params) {
				data = data + this.encodeConstructorParams(params);
			}

			const transaction = new Transaction(
				{
					from: this.options.from,
					data,
					gas: options.gas || this.options.gas!,
					gasPrice: options.gasPrice || this.options.gasPrice!,
					nonce: this.options.nonce
				},
				this.host,
				this.port,
				false
			)
				.gas(this.options.gas)
				.gasPrice(this.options.gasPrice);

			await transaction.sign(account);
			await transaction.submit();

			const receipt = await transaction.receipt;

			return this.setAddressAndPopulateFunctions(receipt.contractAddress);
		} else {
			throw errors.InvalidDataFieldInOptions();
		}
	}

	public setAddressAndPopulateFunctions(address: string): this {
		this.address(address);
		this.attachMethodsToContract();

		return this;
	}

	public address(address: string): this {
		this.options.address = new AddressType(address);
		return this;
	}

	public gas(gas: Gas): this {
		this.options.gas = gas;
		return this;
	}

	public gasPrice(gasPrice: GasPrice): this {
		this.options.gasPrice = gasPrice;
		return this;
	}

	public data(data: Data): this {
		this.options.data = data;
		return this;
	}

	public JSONInterface(abis: ABI[]): this {
		this.options.interface = abis;
		return this;
	}

	private attachMethodsToContract(): void {
		if (!this.options.address) {
			throw new Error(
				'Cannot attach functions. No contract address set.'
			);
		}

		this.options.interface
			.filter(json => json.type === 'function')
			.map((funcABI: ABI) => {
				if (!this.options.address) {
					throw new Error('Cannot attach function');
				}

				const solFunction = new SolidityFunction(
					funcABI,
					this.options.address,
					this.host,
					this.port
				);

				this.methods[
					funcABI.name
				] = solFunction.generateTransaction.bind(solFunction, {
					gas: this.options.gas,
					gasPrice: this.options.gasPrice,
					from: this.options.from
				});
			});
	}

	private encodeConstructorParams(params: any[]): any {
		return (
			this.options.interface
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
