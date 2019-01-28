import * as JSONBig from 'json-bigint';

import {
	Address,
	AddressType,
	ChainID,
	Data,
	Gas,
	GasPrice,
	Nonce,
	parseTransaction,
	Value
} from '../types';

import TransactionClient, { TXReceipt } from '../client/TransactionClient';
import Account from './Account';

export interface CallTXResponse {
	data: string;
}

export interface SentTX {
	from: string;
	to: string;
	value: Value;
	gas: Gas;
	nonce: Nonce;
	gasPrice: GasPrice;
	date: any;
	txHash: string;
}

export interface BaseTX {
	gas: Gas;
	gasPrice: GasPrice;
	nonce?: Nonce;
	chainId?: ChainID;
}

export interface TX extends BaseTX {
	from: Address;
	to?: Address;
	value?: Value;
	data?: Data;
}

export interface ParsedTX extends BaseTX {
	from: string;
	to?: string;
	value?: Value;
	data?: Data;
}

interface OverrideTXOptions {
	to?: string;
	from?: string;
	value?: Value;
	gas?: Gas;
	gasPrice?: GasPrice;
}

export interface SignedTransaction {
	messageHash: string;
	v: string;
	r: string;
	s: string;
	rawTransaction: string;
}

export default class Transaction extends TransactionClient {
	public txReceipt?: TXReceipt;
	public signedTX?: SignedTransaction;
	public hash?: string;

	constructor(
		private tx: TX,
		host: string,
		port: number,
		private constant: boolean,
		private readonly unpackfn?: (data: string) => any
	) {
		super(host, port);
	}

	public get receipt() {
		if (this.hash) {
			return this.getReceipt(this.hash);
		} else {
			throw new Error('Transaction hash not found');
		}
	}

	/**
	 * Send a transaction to a node for a controlled account.
	 *
	 * @param options - Override transactions options
	 *
	 * @deprecated
	 */
	public send(options?: OverrideTXOptions): Promise<TXReceipt> {
		this.assignTXValues(options);

		if (this.constant) {
			throw new Error(
				'Transaction does not mutate state. Use `call()` instead'
			);
		}

		if (!this.tx.data && !this.tx.value) {
			throw new Error('Transaction does have a value to send.');
		}

		return this.sendTX(JSONBig.stringify(parseTransaction(this.tx)))
			.then(response => response.txHash)
			.then(txHash => this.getReceipt(txHash))
			.then(response => {
				this.txReceipt = response;
				return this.txReceipt;
			});
	}

	public async submit(
		options?: OverrideTXOptions,
		account?: Account
	): Promise<this | string> {
		this.assignTXValues(options);

		if (!this.tx.gas || (!this.tx.gasPrice && this.tx.gasPrice !== 0)) {
			throw new Error('Gas or Gas Price not set');
		}

		if (account) {
			await this.sign(account);
		}

		if (!this.signedTX) {
			throw new Error('Transaction has not been signed locally yet.');
		}

		if (!this.tx.data && !this.tx.value) {
			throw new Error('Transaction does have a value to send.');
		}

		if (!this.constant) {
			const { txHash } = await this.sendRaw(this.signedTX.rawTransaction);

			this.hash = txHash;

			return this;
		} else {
			return await this.call();
		}
	}

	public async sign(account: Account): Promise<this> {
		this.signedTX = await account.signTransaction(this);

		return this;
	}

	public async call(options?: OverrideTXOptions): Promise<string> {
		if (!this.constant) {
			throw new Error('Transaction mutates state. Use `send()` instead');
		}

		if (this.tx.value) {
			throw new Error(
				'Transaction cannot have value if it' +
					'does not intend to mutate the state.'
			);
		}

		const call = await this.callTX(this.toString());
		const response = JSONBig.parse<CallTXResponse>(call);

		if (!this.unpackfn) {
			throw new Error('Unpacking function required.');
		}

		return this.unpackfn(Buffer.from(response.data).toString());
	}

	public toJSON(): TX {
		return this.tx;
	}

	public toString(): string {
		return JSONBig.stringify(parseTransaction(this.tx));
	}

	public from(from: string): this {
		this.tx.from = new AddressType(from);
		return this;
	}

	public nonce(nonce: number): this {
		this.tx.nonce = nonce;
		return this;
	}

	public chainID(chainId: number): this {
		this.tx.chainId = chainId;
		return this;
	}

	public to(to: string): this {
		this.tx.to = new AddressType(to);
		return this;
	}

	public value(value: Value): this {
		this.tx.value = value;
		return this;
	}

	public gas(gas: Gas): this {
		this.tx.gas = gas;
		return this;
	}

	public gasPrice(gasPrice: GasPrice): this {
		this.tx.gasPrice = gasPrice;
		return this;
	}

	public data(data: Data): this {
		this.tx.data = data;
		return this;
	}

	private assignTXValues(options?: OverrideTXOptions) {
		if (options) {
			this.tx.to = options.to ? new AddressType(options.to) : this.tx.to;
			this.tx.from = options.from
				? new AddressType(options.from)
				: this.tx.from;

			this.tx.gas = options.gas || this.tx.gas;
			this.tx.value = options.value || this.tx.value;
			this.tx.gasPrice = options.gasPrice || this.tx.gasPrice;
		}
	}
}
