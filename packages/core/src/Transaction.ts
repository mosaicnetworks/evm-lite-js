import EVMTypes from './utils/types';
import Utils from './utils/Utils';

import { Log } from './client/AbstractClient';
import { TransactionReceipt } from './client/AbstractClient';

interface BaseTransaction {
	gas: EVMTypes.Gas;
	gasPrice: EVMTypes.GasPrice;
	nonce?: EVMTypes.Nonce;
	chainId?: EVMTypes.ChainID;
}

export interface TX extends BaseTransaction {
	from: EVMTypes.Address;
	to?: EVMTypes.Address;
	value?: EVMTypes.Value;
	data?: EVMTypes.Data;
}

export interface SignedTransaction {
	readonly messageHash: string;
	readonly v: string;
	readonly r: string;
	readonly s: string;
	readonly rawTransaction: string;
}

export default class Transaction implements TX {
	public from: string;
	public to?: string;
	public value?: number;
	public data?: string;
	public gas: number;
	public gasPrice: number;
	public nonce?: number;
	public chainId?: number;

	public hash?: string;
	public signed?: SignedTransaction;
	public receipt?: TransactionReceipt;

	constructor(
		tx: TX,
		public readonly constant: boolean,
		private readonly parseLogs?: (logs: Log[]) => Log[],
		public readonly unpackfn?: any
	) {
		if (!tx.data && !tx.value) {
			throw Error('Cannot create transaction with no `data` or `value`');
		}

		this.from = Utils.trimHex(tx.from);
		this.to = Utils.trimHex(tx.to || '');
		this.value = tx.value || 0;
		this.data = Utils.trimHex(tx.data || '');
		this.gas = tx.gas;
		this.gasPrice = tx.gasPrice;
		this.nonce = tx.nonce;
		this.chainId = tx.chainId || 1;
	}

	public beforeSubmission() {
		this.clean();
	}

	public afterSubmission() {
		this.parseReceipt();
	}

	private parseReceipt() {
		if (this.receipt && this.parseLogs) {
			const logs = this.parseLogs(this.receipt.logs);

			this.receipt = {
				...this.receipt,
				logs
			};
		}
	}

	private clean(): void {
		let data: string | undefined = this.data;

		if (!this.from.startsWith('0x')) {
			this.from = `0x${this.from}`.toLowerCase();
		}

		if (this.to && !this.to.startsWith('0x')) {
			this.to = `0x${this.to}`.toLowerCase();
		}

		if (this.from.length !== 42) {
			throw Error(
				'`from` address length is not 42 characters ' +
					'long (including `0x`).'
			);
		}

		if (this.to && this.to.length !== 42) {
			throw Error(
				'`to` address length is not 42 characters ' +
					'long (including `0x`).'
			);
		}

		this.value = this.value || 0;

		if (data) {
			if (!data.startsWith('0x')) {
				data = `0x${data}`;
			}

			this.data = data;
		}
	}
}
