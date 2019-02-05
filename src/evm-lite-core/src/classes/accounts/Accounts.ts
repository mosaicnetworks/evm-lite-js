import { Accounts as Web3Accounts } from 'web3-eth-accounts';

import { Address, AddressType, Value } from '../../types';
import Transaction, { BaseTransaction } from '../transaction/Transaction';
import { V3JSONKeyStore } from './Account';

import DefaultClient from '../../clients/DefaultClient';
import Account from './Account';

interface AccountDefaultOptions extends BaseTransaction {
	from: Address;
}

export default class Accounts extends DefaultClient {
	private accounts: Web3Accounts;

	/**
	 * The root cotnroller class for interacting with accounts.
	 *
	 * @param host - The host of the active node.
	 * @param port - The port of the HTTP service.
	 * @param contractOptions - The default options for accounts
	 */
	constructor(
		host: string,
		port: number,
		private accountOptions: AccountDefaultOptions
	) {
		super(host, port);

		this.accounts = new Web3Accounts('http://', {
			defaultAccount: '0X0000000000000000000000000000000000000000',
			defaultGas: 0,
			defaultGasPrice: ''
		});
	}

	/**
	 * Should decrypt an encrypted account.
	 *
	 * @remarks
	 * A decrypted account will have access to the `sign()`, `privateKey` and
	 * `signTransaction()` attribute. Allowing to sign transactions.
	 *
	 * ```typescript
	 * // Create a new accounts controller instance
	 * const controller = new Accounts();
	 * // Create and encrypt a new account with a password
	 * const keystore = controller.create().encrypt('password');
	 * // Decrypt the account with corresponding password
	 * const decrypted = controller.decrypt(keystore, 'password');
	 * ```
	 *
	 * @param v3JSONKeyStore - The `v3` JSON keystore of the address.
	 * @param password - The password used to encrypt to the keystore.
	 */
	public decrypt(v3JSONKeyStore: V3JSONKeyStore, password: string) {
		const account = this.accounts.decrypt(v3JSONKeyStore, password);
		return new Account(account);
	}

	/**
	 * Should create a new `Account` object.
	 *
	 * @remarks
	 * ```typescript
	 * // Create a new account
	 * const account = new Accounts().create();
	 * ```
	 *
	 * @param entropy - The entropy of the accounts address.
	 */
	public create(entropy?: string): Account {
		const randomHex = require('crypto-random-hex');

		return new Account(this.accounts.create(entropy || randomHex(32)));
	}

	/**
	 * Should prepare a transaction to transfer `value` to the specified `to`
	 * address.
	 *
	 * @remarks
	 * This function will also fetch the nonce from the node with connection
	 * details specified in the contructor for this class.
	 *
	 * ```typescript
	 * const transfer = async () {
	 *     // Prepare a transfer transaction to submitted after signing
	 *     const transaction = await evmlc.prepareTransfer('TO_ADDRESS', 200);
	 *     // Sign the transaction with a new  account and submit to node.
	 *     await transaction.submit({}, evmlc.accounts.create())
	 * }
	 * ```
	 *
	 * @param to - The address to transfer funds to.
	 * @param value - The amount to transfer.
	 * @param from - Overrides `from` address set in the constructor.
	 */
	public prepareTransfer(
		to: string,
		value: Value,
		from?: string
	): Promise<Transaction> {
		const fromObject = new AddressType(
			(from || this.accountOptions.from.value).trim()
		);

		if (!fromObject.value) {
			throw new Error(
				'Default `from` address cannot be left blank or empty.'
			);
		}

		if (!to) {
			throw new Error('Must provide a `to` address!');
		}

		if (value <= 0) {
			throw new Error(
				'A transfer of funds must have a `value` greater than 0.'
			);
		}

		return this.getAccount(fromObject.value).then(
			account =>
				new Transaction(
					{
						from: fromObject,
						to: new AddressType(to.trim()),
						value,
						gas: this.accountOptions.gas,
						gasPrice: this.accountOptions.gasPrice,
						nonce: account.nonce,
						chainId: 1
					},
					this.host,
					this.port,
					false
				)
		);
	}

	/**
	 * The defaults for contracts created from this object.
	 */
	get defaults() {
		return {
			from: this.accountOptions.from.value,
			gas: this.accountOptions.gas,
			gasPrice: this.accountOptions.gasPrice
		};
	}
}
