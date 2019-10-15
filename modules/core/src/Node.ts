import { IAbstractConsensus } from 'evm-lite-consensus';

import Client, { BaseInfo, TxReceipt } from 'evm-lite-client';
import utils, { Currency } from 'evm-lite-utils';

import Account from './Account';
import Transaction from './Transaction';

export type EVMAccount = {
	address: string;
	balance: Currency;
	nonce: number;
	bytecode: string;
};

export default class Node<TConsensus extends IAbstractConsensus | undefined> {
	// a node requires an underlying consensus protocol (solo | babble | ...)
	public readonly consensus?: TConsensus;

	private readonly client: Client;

	constructor(host: string, port: number = 8080, consensus?: TConsensus) {
		this.client = new Client(host, port);

		this.consensus = consensus;
	}

	/**
	 * Sends a payable transaction to the node and returns the transaction
	 * receipt of the transaction.
	 *
	 * @remarks
	 * The returned receipt will have its `logs` parsed if any automatically
	 * with the corresponding decoders.
	 *
	 * @param tx - The transaction to be sent
	 * @param account - The account used to sign the transaction
	 * @returns A promise resolving a transaction receipt
	 *
	 * @alpha
	 */
	public async sendTx(tx: Transaction, account: Account): Promise<TxReceipt> {
		// will parse the transaction to insert any missing '0x'
		tx.beforeSubmission();

		if (!tx.from) {
			return Promise.reject(
				Error('Non constant transaction requires a `from` address.')
			);
		}

		// first check if the fields required are present and not undefined.
		if (!tx.gas || (!tx.gasPrice && tx.gasPrice !== 0)) {
			return Promise.reject(
				Error('Transaction `gas` or `gasPrice` not set.')
			);
		}

		// a transaction has to contain one, both or the other.
		if (!tx.data && !tx.value) {
			return Promise.reject(
				Error('Transaction does not have a value to send.')
			);
		}

		// make sure transaction is not constant
		if (tx.constant) {
			return Promise.reject(
				Error(
					'Constant transactions cannot be sent. ' +
						'Use `.callTransaction()` instead.'
				)
			);
		}

		// check if the from address is the same as the account
		// that was passed to sign.
		if (
			utils.cleanAddress(account.address) !== utils.cleanAddress(tx.from)
		) {
			return Promise.reject(
				Error(
					'Transaction `from` address is not the same as ' +
						'`account` provided.'
				)
			);
		}

		// fetch nonce from the node for the associated account
		if (!tx.nonce) {
			const baseAccount = await this.client.getAccount(tx.from);

			tx.nonce = baseAccount.nonce;
		}

		// sign the transaction
		tx.signed = await account.signTx(tx);
		if (!tx.signed) {
			return Promise.reject(
				Error('Transaction has not been signed yet.')
			);
		}

		try {
			tx.receipt = await this.client.sendTx(tx.signed.rawTransaction);
		} catch (e) {
			const err = e
				.toString()
				.toString()
				.toLowerCase()
				.trim()
				.replace(/(\r\n|\n|\r)/gm, '');

			if (err === 'nonce too low') {
				const pool = await this.client.getAccount(tx.from, true);

				// clone tx object
				const pooltx = { ...tx };

				tx.nonce = pool.nonce;

				if (tx.nonce === pooltx.nonce) {
					return Promise.reject(
						`nonce too low - txpool nonce same as ethstate`
					);
				}

				return this.sendTx(tx, account);
			}

			return Promise.reject(`evm-lite: ${err}`);
		}

		// parse any logs that may have been returned with the receipt
		// parsing of logs is different per transaction
		// the abstraction is taken care of when creating transactions
		// through the `Contract` object
		tx.afterSubmission();

		return Promise.resolve(tx.receipt);
	}

	/**
	 * Sends a pure/view transaction to the node and returns the return of the
	 * contract function.
	 *
	 * @remarks
	 * The returned object will be parsed to JS types.
	 *
	 * @param tx - The transaction class to be sent
	 * @returns A promise resolving the return of the contract function
	 *
	 * @alpha
	 */
	public async callTx<R>(tx: Transaction): Promise<R> {
		// cleans transaction attributes
		tx.beforeSubmission();

		// make sure transaction is constant
		if (!tx.constant) {
			return Promise.reject(
				Error(
					'Transaction mutates state. ' +
						'Use `.sendTransaction()` instead'
				)
			);
		}

		// `value` cannot be set on the transaction
		if (tx.value && tx.value.isGreaterThan(0)) {
			return Promise.reject(
				Error(
					'Transaction cannot send a `value` if it' +
						'does not intend to mutate the state.'
				)
			);
		}

		// not needed fields
		delete tx.from;
		delete tx.nonce;

		// TODO: temp fix to gasPrice being required to be an into on evm-lite
		// evm-lite should parse from string
		const sTx = {
			...tx,
			value: 0,
			gasPrice: Number(tx.gasPrice.format('a').slice(0, -1))
		};

		delete sTx.constant;

		// send transaction (without signing)
		const call = await this.client.callTx(JSON.stringify(sTx));

		// since the function is constant no transaction hash will be returned
		// from the submission however the return of the `contract's function`
		// will be therefore we need a function to decode the returned results
		// so we need to make sure that function exists
		if (!tx.unpackfn) {
			return Promise.reject(
				Error('Unpacking function required but not found.')
			);
		}

		return tx.unpackfn(Buffer.from(call.data).toString());
	}

	public async transfer(
		from: Account,
		to: string,
		value: Currency,
		gas: number,
		gasPrice: Currency
	): Promise<TxReceipt> {
		const tx = new Transaction({
			from: from.address,
			to: to.trim(),
			value,
			gas,
			gasPrice
		});

		return await this.sendTx(tx, from);
	}

	// client interface
	public async getAccount(address: string): Promise<EVMAccount> {
		const a = await this.client.getAccount(address);

		return {
			...a,
			balance: new Currency(a.balance)
		};
	}

	public async getPOA() {
		return this.client.getPOAContract();
	}

	public async getInfo<T extends BaseInfo>() {
		return this.client.getInfo<T>();
	}

	public async getReceipt(hash: string) {
		return this.client.getReceipt(hash);
	}
}
