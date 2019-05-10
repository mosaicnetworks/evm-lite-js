import { EVM, SentTX } from 'evm-lite-core';

export type TransactionSchema = SentTX;

export default class Transaction {
	private readonly data: TransactionSchema;

	constructor(sentTX?: TransactionSchema) {
		this.data = {
			from: (sentTX && sentTX.from) || '',
			to: (sentTX && sentTX.to) || '',
			txHash: (sentTX && sentTX.txHash) || '',
			value: (sentTX && sentTX.value) || 0,
			gas: (sentTX && sentTX.gas) || 0,
			gasPrice: (sentTX && sentTX.gasPrice) || 0,
			nonce: (sentTX && sentTX.nonce) || 0,
			date: (sentTX && sentTX.date) || ''
		};
	}

	get raw(): TransactionSchema {
		return this.data;
	}

	public date(value: any): this {
		this.data.date = value;
		return this;
	}

	public from(value: EVM.Address): this {
		this.data.from = value;
		return this;
	}

	public gas(value: EVM.Gas): this {
		this.data.gas = value;
		return this;
	}

	public gasPrice(value: EVM.GasPrice): this {
		this.data.gasPrice = value;
		return this;
	}

	public nonce(value: EVM.Nonce): this {
		this.data.nonce = value;
		return this;
	}

	public to(value: EVM.Address): this {
		this.data.to = value;
		return this;
	}

	public txHash(value: string): this {
		this.data.txHash = value;
		return this;
	}

	public value(value: EVM.Value): this {
		this.data.value = value;
		return this;
	}
}
