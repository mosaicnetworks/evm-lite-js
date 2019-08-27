import { IAbstractConsensus } from 'evm-lite-solo';

import Account from 'evm-lite-account';
import Transaction from 'evm-lite-transaction';
import utils from 'evm-lite-utils';

import Client, { IReceipt } from 'evm-lite-client';

export default class Node<TConsensus extends IAbstractConsensus> {
	// a node requires an underlying consensus protocol (solo | babble | ...)
	public readonly consensus: TConsensus;

	private readonly client: Client;

	constructor(host: string, port: number = 8080, consensus: TConsensus) {
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
	public async sendTx(tx: Transaction, account: Account): Promise<IReceipt> {
		// will parse the transaction to insert any missing '0x'
		tx.beforeSubmission();

		if (!tx.from) {
			return Promise.reject(
				new Error('Non constant transaction requires a `from` address.')
			);
		}

		// first check if the fields required are present and not undefined.
		if (!tx.gas || (!tx.gasPrice && tx.gasPrice !== 0)) {
			return Promise.reject(
				new Error('Transaction `gas` or `gasPrice` not set.')
			);
		}

		// a transaction has to contain one, both or the other.
		if (!tx.data && !tx.value) {
			return Promise.reject(
				new Error('Transaction does not have a value to send.')
			);
		}

		// make sure transaction is not constant
		if (tx.constant) {
			return Promise.reject(
				new Error(
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
				new Error(
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
				new Error('Transaction has not been signed yet.')
			);
		}

		console.log(tx);

		try {
			tx.receipt = await this.client.sendTx(tx.signed.rawTransaction);
		} catch (e) {
			return Promise.reject(`evm-lite: ${e.text || e.toString()}`);
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
				new Error(
					'Transaction mutates state. ' +
						'Use `.sendTransaction()` instead'
				)
			);
		}

		// `value` cannot be set on the transaction
		if (tx.value) {
			return Promise.reject(
				new Error(
					'Transaction cannot send a `value` if it' +
						'does not intend to mutate the state.'
				)
			);
		}

		// not needed fields
		delete tx.from;
		delete tx.nonce;

		// send transaction (without signing)
		const call = await this.client.callTx(JSON.stringify(tx));

		// since the function is constant no transaction hash will be returned
		// from the submission however the return of the `contract's function`
		// will be therefore we need a function to decode the returned results
		// so we need to make sure that function exists
		if (!tx.unpackfn) {
			return Promise.reject(
				new Error('Unpacking function required but not found.')
			);
		}

		return tx.unpackfn(Buffer.from(call.data).toString());
	}

	public async transfer(
		from: Account,
		to: string,
		value: number,
		gas: number,
		gasPrice: number
	): Promise<IReceipt> {
		if (value <= 0) {
			throw new Error(
				'A transfer of funds must have a `value` greater than 0.'
			);
		}

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

	public async getAccount(address: string) {
		return this.client.getAccount(address);
	}

	public async getPOA() {
		return this.client.getPOAContract();
	}

	public async getInfo() {
		return this.client.getInfo();
	}

	public async getReceipt(hash: string) {
		return this.client.getReceipt(hash);
	}
}
