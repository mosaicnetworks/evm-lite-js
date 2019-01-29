// @ts-ignore
import * as coder from 'web3/lib/solidity/coder';
// @ts-ignore
import * as SolFunction from 'web3/lib/web3/function';

import * as errors from '../utils/errors';

import { ABI, Input } from '../..';
import {
	AddressType,
	EVMType,
	Gas,
	GasPrice,
	parseSolidityTypes
} from '../types';

import AccountClient from '../client/AccountClient';
import Transaction, { TX } from './Transaction';

export default class SolidityFunction extends AccountClient {
	public readonly name: string;
	public readonly inputTypes: EVMType[];
	public readonly outputTypes: EVMType[];
	public readonly solFunction: SolFunction;
	public readonly constant: boolean;
	public readonly payable: boolean;

	constructor(
		abi: ABI,
		readonly contractAddress: AddressType,
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

	public async generateTransaction(
		options: { from: AddressType; gas: Gas; gasPrice: GasPrice },
		...funcArgs: any[]
	): Promise<Transaction> {
		this.validateArgs(funcArgs);

		const payload = this.solFunction.toPayload(funcArgs);
		const tx: TX = {
			from: options.from,
			to: this.contractAddress,
			gas: options.gas,
			gasPrice: options.gasPrice
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

		const account = await this.getAccount(tx.from.value);

		return new Transaction(
			{
				...tx,
				nonce: account.nonce
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
			if (parseSolidityTypes(typeof a) === this.inputTypes[i]) {
				throw errors.InvalidSolidityType();
			}
		});
	}
}
