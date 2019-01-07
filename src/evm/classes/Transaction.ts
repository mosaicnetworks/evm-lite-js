import * as JSONBig from 'json-bigint';

import { Address, AddressType, ChainID, Data, Gas, GasPrice, Nonce, parseTransaction, Value } from '../types';

import TransactionClient, { TXReceipt } from '../client/TransactionClient';
import Account from './Account';


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

interface OverrideTXOptions {
	to?: string,
	from?: string,
	value?: Value,
	gas?: Gas,
	gasPrice?: GasPrice
}

export interface SignedTransaction {
	messageHash: string;
	v: string;
	r: string;
	s: string;
	rawTransaction: string;
}

export default class Transaction extends TransactionClient {

	public receipt?: TXReceipt;
	public signedTX?: SignedTransaction;

	constructor(public tx: TX, host: string, port: number, private constant: boolean,
				private readonly unpackfn?: (data: string) => any) {
		super(host, port);
	}

	public send(options?: OverrideTXOptions): Promise<TXReceipt> {
		this.assignTXValues(options);
		this.checkGasAndGasPrice();

		if (this.constant) {
			throw new Error('Transaction does not mutate state. Use `call()` instead');
		}

		if (!this.tx.data && !this.tx.value) {
			throw new Error('Transaction does have a value to send.');
		}

		return this.sendTX(JSONBig.stringify(parseTransaction(this.tx)))
			.then((res) => {
				const response: { txHash: string } = JSONBig.parse(res);
				return response.txHash;
			})
			.then((txHash) => {
				return this.getReceipt(txHash);
			})
			.then((response) => {
				this.receipt = response;
				return this.receipt;
			});
	}

	public sendRawTX(options?: OverrideTXOptions): Promise<TXReceipt> {
		this.assignTXValues(options);
		this.checkGasAndGasPrice();

		if (!this.signedTX) {
			throw new Error('Transaction has not been signed locally yet.');
		}

		if (this.constant) {
			throw new Error('Transaction does not mutate state. Use `call()` instead');
		}

		if (!this.tx.data && !this.tx.value) {
			throw new Error('Transaction does have a value to send.');
		}

		return this.sendRaw(this.signedTX.rawTransaction)
			.then((res) => {
				return res.txHash;
			})
			.then((txHash) => {
				return this.getReceipt(txHash);
			})
			.then((response) => {
				this.receipt = response;
				return this.receipt;
			});
	}

	public async sign(account: Account): Promise<this> {
		this.signedTX = await account.signTransaction(this);

		return this;
	}

	public call(options?: OverrideTXOptions): Promise<string> {
		this.assignTXValues(options);
		this.checkGasAndGasPrice();

		if (!this.constant) {
			throw new Error('Transaction mutates state. Use `send()` instead');
		}

		if (this.tx.value) {
			throw new Error('Transaction cannot have value if it does not intend to mutate state.');
		}

		return this.callTX(JSONBig.stringify(parseTransaction(this.tx)))
			.then((response) => {
				return JSONBig.parse(response);
			})
			.then((obj: any) => {
				if (!this.unpackfn) {
					throw new Error('Unpacking function required.');
				}

				return this.unpackfn(Buffer.from(obj.data).toString());
			});
	}

	public toString(): string {
		return JSONBig.stringify(parseTransaction(this.tx));
	}

	public from(from: string): this {
		this.tx.from = new AddressType(from);
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
			this.tx.to = (options.to) ? new AddressType(options.to) : this.tx.to;
			this.tx.from = (options.from) ? new AddressType(options.from) : this.tx.from;

			this.tx.gas = options.gas || this.tx.gas;
			this.tx.value = options.value || this.tx.value;
			this.tx.gasPrice = options.gasPrice || this.tx.gasPrice;
		}
	}

	private checkGasAndGasPrice() {
		if (!this.tx.gas || (!this.tx.gasPrice && this.tx.gasPrice !== 0)) {
			throw new Error('Gas & Gas Price not set');
		}
	}

}
