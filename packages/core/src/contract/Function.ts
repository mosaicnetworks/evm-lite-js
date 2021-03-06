// @ts-ignore
import coder from 'web3/lib/solidity/coder';
// @ts-ignore
const SolFunction = require('web3/lib/web3/function');

import { IABI, IInput, ILog } from 'evm-lite-client';

import Transaction, { ITransaction } from '../Transaction';

export default class Function {
	public readonly name: string;
	public readonly inputTypes: any[];
	public readonly outputTypes: any[];
	public readonly solFunction: any;
	public readonly constant: boolean;
	public readonly payable: boolean;

	constructor(
		private readonly abi: IABI,
		private readonly contractAddress: string
	) {
		this.name = abi.name || 'NoName';
		this.payable = abi.stateMutability === 'payable' || abi.payable;
		this.constant =
			abi.stateMutability === 'view' ||
			abi.stateMutability === 'pure' ||
			abi.constant;

		this.inputTypes = abi.inputs.map((i: IInput) => {
			return i.type;
		});
		this.outputTypes =
			(abi.outputs &&
				abi.outputs.map((i: IInput) => {
					return i.type;
				})) ||
			[];
		this.solFunction = new SolFunction('', abi, '');
	}

	public unpackOutput(output: string): any {
		const result = coder.decodeParams(
			this.outputTypes,
			output.length >= 2 ? output.slice(2) : output
		);

		return result.length === 1 ? result[0] : result;
	}

	// TODO: Needs to take arguments for events ABI and functio ABI
	public generateTransaction(
		parseLogs: (logs: ILog[]) => ILog[],
		options: ITransaction,
		...funcArgs: any[]
	): Transaction {
		// this.validateArgs(funcArgs);

		const payload = this.solFunction.toPayload(funcArgs);
		const tx: ITransaction = {
			...options,
			to: this.contractAddress
		};

		tx.data = payload.data;

		if (tx.value && tx.value <= 0 && this.payable) {
			throw Error(
				'Function is payable and requires `value` greater than 0.'
			);
		} else if (tx.value && tx.value > 0 && !this.payable) {
			throw Error('Function is not payable. Required `value` is 0.');
		}

		let unpackfn: any | undefined;
		if (this.constant) {
			unpackfn = this.unpackOutput.bind(this);
		}

		return new Transaction(
			{
				...tx
			},
			this.constant,
			parseLogs,
			unpackfn
		);
	}
}
