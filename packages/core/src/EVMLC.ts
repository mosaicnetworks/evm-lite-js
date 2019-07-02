import AbstractClient, { TransactionReceipt } from './client/AbstractClient';

import Account from './Account';
import Transaction from './Transaction';
import Utils from './utils/Utils';

function delay(t: number, v?: any) {
	return new Promise(resolve => {
		setTimeout(resolve.bind(null, v), t * 1000);
	});
}

export default class EVMLC extends AbstractClient {
	constructor(host: string, port: number) {
		super(host, port);
	}

	public async sendTransaction(
		tx: Transaction,
		account: Account
	): Promise<TransactionReceipt> {
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
			Utils.cleanAddress(account.address) !== Utils.cleanAddress(tx.from)
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
			const baseAccount = await this.getAccount(tx.from);

			tx.nonce = baseAccount.nonce;
		}

		// sign the transaction
		tx.signed = await account.signTransaction(tx);
		if (!tx.signed) {
			return Promise.reject(
				new Error('Transaction has not been signed yet.')
			);
		}

		let hash: string;
		try {
			const response = await this.sendRaw(tx.signed.rawTransaction);
			hash = response.txHash;
		} catch (e) {
			return Promise.reject(
				`EVM-Lite: ${e.text.charAt(0).toUpperCase() + e.text.slice(1)}`
			);
		}

		// temp until logs and subscribtions
		await delay(5);

		tx.hash = hash;
		tx.receipt = await this.getReceipt(hash);

		// parse any logs that may have been returned with the receipt
		// parsing of logs is different per transaction
		// the abstraction is taken care of when creating transactions
		// through the `Contract` object
		tx.afterSubmission();

		return Promise.resolve(tx.receipt);
	}

	// TODO: Still needs to be finished
	// TODO: Define what this generic `R` means!
	public async callTransaction<R>(transaction: Transaction): Promise<R> {
		// cleans transaction attributes
		transaction.beforeSubmission();

		// make sure transaction is constant
		if (!transaction.constant) {
			return Promise.reject(
				new Error(
					'Transaction mutates state. ' +
						'Use `.sendTransaction()` instead'
				)
			);
		}

		// `value` cannot be set on the transaction
		if (transaction.value) {
			return Promise.reject(
				new Error(
					'Transaction cannot send a `value` if it' +
						'does not intend to mutate the state.'
				)
			);
		}

		// not needed fields
		delete transaction.nonce;
		delete transaction.from;

		// send transaction (without signing)
		const call = await this.callTX(JSON.stringify(transaction));

		// since the function is constant no transaction hash will be returned
		// from the submission however the return of the `contract's function`
		// will be therefore we need a function to decode the returned results
		// so we need to make sure that function exists
		if (!transaction.unpackfn) {
			return Promise.reject(
				new Error('Unpacking function required but not found.')
			);
		}

		return transaction.unpackfn(Buffer.from(call.data).toString());
	}
}
