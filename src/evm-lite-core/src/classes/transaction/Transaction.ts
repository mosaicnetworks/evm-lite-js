import * as JSONBig from 'json-bigint';

import TransactionClient, { TXReceipt } from '../../clients/TransactionClient';

import AccountClient from '../../clients/AccountClient';
import EVM from '../../types';
import Account from '../accounts/Account';

export interface CallTransactionResponse {
	data: string;
}

export interface BaseTransaction {
	gas: EVM.Gas;
	gasPrice: EVM.GasPrice;
	nonce?: EVM.Nonce;
	chainId?: EVM.ChainID;
}

export interface TX extends BaseTransaction {
	from: EVM.Address;
	to?: EVM.Address;
	value?: EVM.Value;
	data?: EVM.Data;
}

export interface SentTransaction extends TX {
	date: any;
	txHash: string;
}

interface OverrideTXOptions {
	to?: EVM.Address;
	from?: EVM.Address;
	value?: EVM.Value;
	gas?: EVM.Gas;
	gasPrice?: EVM.GasPrice;
	timeout?: number;
}

export interface SignedTransaction {
	messageHash: string;
	v: string;
	r: string;
	s: string;
	rawTransaction: string;
}

function delay(t: number, v?: any) {
	return new Promise(resolve => {
		setTimeout(resolve.bind(null, v), t);
	});
}

export default class Transaction extends TransactionClient {
	public txReceipt?: TXReceipt;
	public signedTX?: SignedTransaction;
	public hash?: string;

	/**
	 * All transactions used to interact with the EVM are parsed through this
	 * object.
	 *
	 * @remarks
	 * This class should not be directly instantiated from outide this library.
	 *
	 * @param tx - The transaction parameters.
	 * @param host - The host of active node.
	 * @param port - The port the HTTP API is listening on that node.
	 * @param constant - Whether the transaction is constant.
	 * @param unpackfn = Unpacking function used to decode `call()` returns.
	 */
	constructor(
		private tx: TX,
		host: string,
		port: number,
		private constant: boolean,
		private readonly unpackfn?: (data: string) => any
	) {
		super(host, port);

		// Default to 1
		this.chainID(this.tx.chainId || 1)
	}

	/**
	 * Should send a transaction to a node for a controlled account.
	 *
	 * @remarks
	 * This function will not sign the transaction before sending meaning
	 * that the `from` address has to have a corresponding keystore file
	 * on the node.
	 *
	 * @param options - Override transactions options
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

		return this.sendTX(this.parseToString())
			.then(response => response.txHash)
			.then(txHash => this.getReceipt(txHash))
			.then(response => {
				this.txReceipt = response;
				return this.txReceipt;
			});
	}

	/**
	 * Should `send()` or `call()` the transaction or message.
	 *
	 * @remarks
	 * This function will automatically determine whether the function mutates
	 * the state and decide whether to `call` or `send`.
	 *
	 * @param options - Override transaction options.
	 * @param account - The account to sign this transaction.
	 */
	public async submit(
		account?: Account,
		options?: OverrideTXOptions
	): Promise<this | any[]> {
		await this.assignTXValues(options);

		if (!this.tx.gas || (!this.tx.gasPrice && this.tx.gasPrice !== 0)) {
			throw new Error('Fields `gas` or `gasPrice` not set.');
		}

		if (!this.tx.data && !this.tx.value) {
			throw new Error('Transaction does not have a value to send.');
		}

		const timeout = ((options && options.timeout) || 0) * 1000;

		if (!this.constant) {
			if (account) {
				await this.sign(account);
			}

			if (!this.signedTX) {
				throw new Error('Transaction has not been signed locally.');
			}

			const { txHash } = await this.sendRaw(this.signedTX.rawTransaction);

			await delay(timeout);

			this.hash = txHash;

			return this;
		} else {
			return await this.call({ timeout });
		}
	}

	/**
	 * Should fetch the receipt from the node with connection details specified
	 * in the contructor of this class.
	 */
	public get receipt() {
		if (this.hash) {
			return this.getReceipt(this.hash);
		} else {
			throw new Error('Transaction hash not found.');
		}
	}

	/**
	 * Should submit a `call` action to the EVM to retrieve data from a
	 * smart contract.
	 *
	 * @remarks
	 * The transactions do not need to be signed nor does it mutate the state.
	 *
	 * @param options - The options to override transaction attributes.
	 */
	public async call(options?: OverrideTXOptions): Promise<any[]> {
		if (!this.constant) {
			throw new Error('Transaction mutates state. Use `send()` instead');
		}

		if (this.tx.value) {
			throw new Error(
				'Transaction cannot have value if it' +
					'does not intend to mutate the state.'
			);
		}

		const tx = JSON.parse(this.parseToString());

		delete tx.chainId;
		delete tx.nonce;

		const call = await this.callTX(JSON.stringify(tx));
		const response = JSONBig.parse<CallTransactionResponse>(call);

		if (!this.unpackfn) {
			throw new Error('Unpacking function required.');
		}

		return this.unpackfn(Buffer.from(response.data).toString());
	}

	/**
	 * Should return the parsed version of the transaction with native
	 * types.
	 */
	public parse(): TX {
		let data: string | undefined = this.tx.data;

		const parsedTX = {
			...this.tx,

			from: this.tx.from && this.tx.from.toLowerCase(),
			to: (this.tx.to && this.tx.to.toLowerCase()) || '',
			value: this.tx.value || 0,
			nonce: this.tx.nonce
		};

		if (data) {
			if (!data.startsWith('0x')) {
				data = `0x${data}`;
			}

			parsedTX.data = data;
		}

		return parsedTX;
	}

	/**
	 * Should return the stringified version of `.parse()`.
	 */
	public parseToString(): string {
		return JSONBig.stringify(this.parse());
	}

	/**
	 * Set the `from` address of the transaction.
	 *
	 * @param from - The `from` address of the transaction.
	 */
	public from(from: EVM.Address): this {
		this.tx.from = from;
		return this;
	}

	/**
	 * Set the `nonce` of the transaction.
	 *
	 * @param nonce - The `nonce` of the transaction.
	 */
	public nonce(nonce: EVM.Nonce): this {
		this.tx.nonce = nonce;
		return this;
	}

	/**
	 * Set the `chainId` of the transaction.
	 *
	 * @param chainId - The `chainId` of the transaction.
	 */
	public chainID(chainId: EVM.ChainID): this {
		this.tx.chainId = chainId;
		return this;
	}

	/**
	 * Set the `to` address of the transaction.
	 *
	 * @param to - The `to` address of the transaction.
	 */
	public to(to: string): this {
		this.tx.to = to;
		return this;
	}

	/**
	 * Set the `value` of the transaction.
	 *
	 * @param value - The `value` of the transaction.
	 */
	public value(value: EVM.Value): this {
		this.tx.value = value;
		return this;
	}

	/**
	 * Set the `gas` of the transaction.
	 *
	 * @param gas - The `gas` of the transaction.
	 */
	public gas(gas: EVM.Gas): this {
		this.tx.gas = gas;
		return this;
	}

	/**
	 * Set the `gasPrice` of the transaction.
	 *
	 * @param gasPrice - The `gasPrice` of the transaction.
	 */
	public gasPrice(gasPrice: EVM.GasPrice): this {
		this.tx.gasPrice = gasPrice;
		return this;
	}

	/**
	 * Set the `data` of the transaction.
	 *
	 * @param data - The `data` of the transaction.
	 */
	public data(data: EVM.Data): this {
		this.tx.data = data;
		return this;
	}

	/**
	 * Should sign this transaction with the given account.
	 *
	 * @param account - The account object to sign with.
	 */
	public async sign(account: Account): Promise<this> {
		if (!this.tx.nonce) {
			await this.assignNonce();
		}

		this.signedTX = await account.signTransaction(this.parse());

		return this;
	}

	/**
	 * Assigns the override options to this transaction.
	 *
	 * @param options - The options to assign.
	 */
	private async assignTXValues(options?: OverrideTXOptions) {
		if (options) {
			this.tx.to = options.to ? options.to : this.tx.to;
			this.tx.from = options.from ? options.from : this.tx.from;
			this.tx.gas = options.gas || this.tx.gas;
			this.tx.value = options.value || this.tx.value;
			this.tx.gasPrice = options.gasPrice || this.tx.gasPrice;
		}
	}

	/**
	 * Assigns the nonce of the transaction if not set.
	 */
	private async assignNonce() {
		const account = await new AccountClient(
			this.host,
			this.port
		).getAccount(this.tx.from);

		this.tx.nonce = account.nonce;
	}
}
