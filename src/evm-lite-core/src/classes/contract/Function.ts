// @ts-ignore
import * as coder from 'web3/lib/solidity/coder';
// @ts-ignore
import * as SolFunction from 'web3/lib/web3/function';

import * as errors from '../../utils/errors';

import { ABI, Input } from './Contract';

import AccountClient from '../../clients/AccountClient';
import EVM from '../../types';
import Transaction, { TX } from '../transaction/Transaction';

export default class Function extends AccountClient {
	public readonly name: string;
	public readonly inputTypes: any[];
	public readonly outputTypes: any[];
	public readonly solFunction: SolFunction;
	public readonly constant: boolean;
	public readonly payable: boolean;

	constructor(
		abi: ABI,
		readonly contractAddress: EVM.Address,
		host: string,
		port: number
	) {
		super(host, port);

		this.name = abi.name;
		this.solFunction = new SolFunction('', abi, '');
		this.constant =
			abi.stateMutability === 'view' ||
			abi.stateMutability === 'pure' ||
			abi.constant;
		this.payable = abi.stateMutability === 'payable' || abi.payable;

		this.inputTypes = abi.inputs.map((i: Input) => {
			return i.type;
		});
		this.outputTypes =
			(abi.outputs &&
				abi.outputs.map((i: Input) => {
					return i.type;
				})) ||
			[];
	}

	public generateTransaction(
		options: {
			from: EVM.Address;
			gas: EVM.Gas;
			gasPrice: EVM.GasPrice;
			// value: Value
		},
		...funcArgs: any[]
	): Transaction {
		this.validateArgs(funcArgs);

		const payload = this.solFunction.toPayload(funcArgs);
		const tx: TX = {
			from: options.from,
			to: this.contractAddress,
			gas: options.gas,
			gasPrice: options.gasPrice,
		};

		tx.data = payload.data;

		if (tx.value && tx.value <= 0 && this.payable) {
			throw Error(
				'Function is payable and requires `value` greater than 0.'
			);
		} else if (tx.value && tx.value > 0 && !this.payable) {
			throw Error('Function is not payable. Required `value` is 0.');
		}

		let unpackfn: ((output: string) => any) | undefined;
		if (this.constant) {
			unpackfn = this.unpackOutput.bind(this);
		}

		return new Transaction(
			{
				...tx
			},
			this.host,
			this.port,
			this.constant,
			unpackfn
		);
	}

	public unpackOutput(output: string): any {
		const result = coder.decodeParams(
			this.outputTypes,
			output.length >= 2 ? output.slice(2) : output
		);

		return result.length === 1 ? result[0] : result;
	}

	private validateArgs(args: any[]): void {
		this.requireArgsLength(args.length);
		this.requireSolidityTypes(args);
	}

	private requireArgsLength(received: number): void {
		const expected = this.inputTypes.length;

		if (expected !== received) {
			throw errors.InvalidNumberOfSolidityArgs(expected, received);
		}
	}

	private requireSolidityTypes(args: any[]): void {
		args.map((a, i) => {
			if (typeof a === this.inputTypes[i]) {
				throw errors.InvalidSolidityType();
			}
		});
	}
}
