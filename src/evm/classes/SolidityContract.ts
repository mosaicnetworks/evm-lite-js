// @ts-ignore
import * as coder from 'web3/lib/solidity/coder';

import * as checks from '../utils/checks';
import * as errors from '../utils/errors';

import { ABI, TXReceipt } from '../..';
import { Address, AddressType, Data, Gas, GasPrice } from '../types';

import SolidityFunction from './SolidityFunction';
import Transaction from './Transaction';


export interface ContractOptions {
	gas: Gas,
	gasPrice: GasPrice,
	from: Address,
	address?: Address,
	data?: Data,
	jsonInterface: ABI[]
}

export default class SolidityContract {

	public methods: {
		[key: string]: () => Transaction;
	};
	public web3Contract: any;
	public receipt?: TXReceipt;

	constructor(public options: ContractOptions, private host: string, private port: number) {
		// const web3 = new Web3();
		// this.web3Contract = web3.eth.contract(this.options.jsonInterface).at(this.options.address);

		this.options.address = options.address;
		this.methods = {};

		if (this.options.address) {
			this.attachMethodsToContract();
		}
	}

	public deploy(options?: { parameters?: any[], gas?: Gas, gasPrice?: GasPrice, data?: Data }): Promise<this> {
		if (this.options.address) {
			throw errors.ContractAddressFieldSetAndDeployed();
		}

		this.options.jsonInterface.filter((abi: ABI) => {
			if (abi.type === 'constructor' && (options && options.parameters)) {
				checks.requireArgsLength(abi.inputs.length, options.parameters.length);
			}
		});

		if (options) {
			this.options.data = options.data || this.options.data;
			this.options.gas = options.gas || this.options.gas;
			this.options.gasPrice = options.gasPrice || this.options.gasPrice;
		}

		if (this.options.data) {
			let encodedData = this.options.data;

			if (options && options.parameters) {
				encodedData = encodedData + this.encodeConstructorParams(options.parameters);
			}

			return new Transaction({
				from: this.options.from,
				data: encodedData,
				gas: this.options.gas,
				gasPrice: this.options.gasPrice
			}, this.host, this.port, false)
				.gas(this.options.gas)
				.gasPrice(this.options.gasPrice)
				.send()
				.then((receipt: TXReceipt) => {
					this.receipt = receipt;
					return this.setAddressAndPopulate(this.receipt.contractAddress);
				});
		} else {
			throw errors.InvalidDataFieldInOptions();
		}
	}

	public setAddressAndPopulate(address: string): this {
		this.options.address = new AddressType(address);
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
		this.options.jsonInterface = abis;
		return this;
	}

	private attachMethodsToContract(): void {
		if (!this.options.address) {
			throw new Error('Cannot attach function');
		}
		this.options.jsonInterface.filter((json) => {
			return json.type === 'function';
		})
			.map((funcJSON: ABI) => {
				if (!this.options.address) {
					throw new Error('Cannot attach function');
				}

				const solFunction = new SolidityFunction(funcJSON, this.options.address, this.host, this.port);
				this.methods[funcJSON.name] = solFunction.generateTransaction.bind(solFunction, {
					gas: this.options.gas,
					gasPrice: this.options.gasPrice,
					from: this.options.from
				});
			});
	}

	private encodeConstructorParams(params: any[]): any {
		return this.options.jsonInterface.filter((json) => {
			return json.type === 'constructor' && json.inputs.length === params.length;
		})
			.map((json) => {
				return json.inputs.map((input) => {
					return input.type;
				});
			})
			.map((types) => {
				return coder.encodeParams(types, params);
			})[0] || '';
	}

}
