// @ts-ignore
import * as coder from 'web3/lib/solidity/coder';
// @ts-ignore
import * as SolFunction from 'web3/lib/web3/function';

import * as errors from '../utils/errors';

import { ABI, Input } from '../..';
import { AddressType, EVMType, Gas, GasPrice, parseSolidityTypes } from '../types';

import Transaction, { TX } from './Transaction';


export default class SolidityFunction {

	public readonly name: string;
	public readonly inputTypes: EVMType[];
	public readonly outputTypes: EVMType[];
	public readonly solFunction: SolFunction;
	public readonly constant: boolean;
	public readonly payable: boolean;

	constructor(abi: ABI, readonly contractAddress: AddressType, private host: string, private port: number) {
		this.name = abi.name;
		this.solFunction = new SolFunction('', abi, '');
		this.constant = (abi.stateMutability === 'view' || abi.stateMutability === 'pure' || abi.constant);
		this.payable = (abi.stateMutability === 'payable' || abi.payable);

		this.inputTypes = abi.inputs.map((i: Input) => {
			return i.type;
		});
		this.outputTypes = abi.outputs && abi.outputs.map((i: Input) => {
			return i.type;
		}) || [];
	}

	public generateTransaction(options: { from: AddressType, gas: Gas, gasPrice: GasPrice },
							   ...funcArgs: any[]): Transaction {
		this._validateArgs(funcArgs);

		const callData = this.solFunction.getData();
		const tx: TX = {
			from: options.from,
			to: this.contractAddress,
			gas: options.gas,
			gasPrice: options.gasPrice
		};

		tx.data = callData;

		if (tx.value && tx.value <= 0 && this.payable) {
			throw Error('Function is payable and requires `value` greater than 0.');
		} else if (tx.value && tx.value > 0 && !this.payable) {
			throw Error('Function is not payable. Required `value` is 0.');
		}

		let unpackfn: ((output: string) => any) | undefined;
		if (this.constant) {
			unpackfn = this.unpackOutput.bind(this);
		}

		return new Transaction(tx, this.host, this.port, this.constant, unpackfn);
	}

	public unpackOutput(output: string): any {
		output = output.length >= 2 ? output.slice(2) : output;
		const result = coder.decodeParams(this.outputTypes, output);
		return result.length === 1 ? result[0] : result;
	}

	private _validateArgs(args: any[]): void {
		this.requireArgsLength(args.length);
		this.requireSolidityTypes(args);
	}

	private requireArgsLength(received: number): (boolean | Error) {
		const expected = this.inputTypes.length;
		if (expected !== received) {
			throw errors.InvalidNumberOfSolidityArgs(expected, received);
		} else {
			return true;
		}
	};

	private requireSolidityTypes(args: any[]): void {
		args.map((a, i) => {
			if (parseSolidityTypes(typeof a) === this.inputTypes[i]) {
				throw errors.InvalidSolidityType();
			}
		});
	};
}


