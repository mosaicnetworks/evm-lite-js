import Utils from 'evm-lite-utils';

import EVMTypes from './misc/types';

import { ILog, IReceipt } from './client/BaseEVMLC';

interface BaseTransaction {
	gas: EVMTypes.Gas;
	gasPrice: EVMTypes.GasPrice;
	nonce?: EVMTypes.Nonce;
	chainId?: EVMTypes.ChainID;
}

export interface TX extends BaseTransaction {
	from?: EVMTypes.Address;
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
	public from?: string;
	public to?: string;
	public value?: number;
	public data?: string;
	public gas: number;
	public gasPrice: number;
	public nonce?: number;
	public chainId?: number;

	public hash?: string;
	public signed?: SignedTransaction;
	public receipt?: IReceipt;

	constructor(
		tx: TX,
		public readonly constant: boolean,
		private readonly parseLogs?: (logs: ILog[]) => ILog[],
		public readonly unpackfn?: any
	) {
		if (!tx.data && !tx.value) {
			throw Error('Cannot create transaction with no `data` or `value`');
		}

		if (tx.from) {
			this.from = Utils.trimHex(tx.from);
		}

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

		if (this.from) {
			this.from = Utils.cleanAddress(this.from);

			if (!this.constant) {
				if (this.from.length !== 42) {
					throw Error(
						'`from` address length is not 42 characters ' +
							'(including `0x`).'
					);
				}
			}
		}

		if (this.to) {
			this.to = Utils.cleanAddress(this.to);

			if (this.to.length !== 42) {
				throw Error(
					'`to` address length is not 42 characters ' +
						'(including `0x`).'
				);
			}
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
