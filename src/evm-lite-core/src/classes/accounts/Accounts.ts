import { Accounts as Web3Accounts } from 'web3-eth-accounts';

import { V3JSONKeyStore } from './Account';

import { Defaults } from '../EVMLC';

import Transaction, { BaseTransaction } from '../transaction/Transaction';

import EVM from '../../types';
import Account from './Account';

export default class Accounts {
	private accounts: Web3Accounts;

	/**
	 * The root cotnroller class for interacting with accounts.
	 *
	 * @param host - The host of the active node.
	 * @param port - The port of the HTTP service.
	 * @param defaults - The default options for accounts
	 */
	constructor(
		private readonly host: string,
		private readonly port: number,
		public defaults: Defaults
	) {
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
	 * const keystore = evmlc.accounts.create().encrypt('password');
	 * const decrypted = evmlc.accounts.decrypt(keystore, 'password');
	 * ```
	 *
	 * @param v3JSONKeyStore - The `v3` JSON keystore of the encrypted address.
	 * @param password - The password used to encrypt to the keystore.
	 */
	public decrypt(v3JSONKeyStore: V3JSONKeyStore, password: string) {
		const account = this.accounts.decrypt(v3JSONKeyStore, password);

		// @ts-ignore
		return new Account(account);
	}

	/**
	 * Should create a new `Account` object.
	 *
	 * @remarks
	 * ```typescript
	 * const account = evmlc.accounts.create();
	 * ```
	 *
	 * @param entropy - The entropy of the accounts address.
	 */
	public create(entropy?: string): Account {
		const randomHex = require('crypto-random-hex');

		// @ts-ignore
		return new Account(this.accounts.create(entropy || randomHex(32)));
	}

	/**
	 * Should prepare a transaction to transfer `value` to the specified `to`
	 * address.
	 *
	 * @remarks
	 * This function will not fetch nonce from the node. The example shows
	 * how to make a trnasfer of 200 tokens.
	 *
	 * ```typescript
	 * const transfer = async () {
	 *     const transaction = evmlc.prepareTransfer('TO_ADDRESS', 200);
	 *     await transaction.submit(evmlc.accounts.create())
	 * }
	 * ```
	 *
	 * @param to - The address to transfer funds to.
	 * @param value - The amount to transfer.
	 * @param from - Overrides `from` address set in the constructor.
	 */
	public prepareTransfer(
		to: EVM.Address,
		value: EVM.Value,
		from?: EVM.Address
	): Transaction {
		const _from = (from || this.defaults.from).trim();

		if (!_from) {
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

		return new Transaction(
			{
				from: _from,
				to: to.trim(),
				value,
				gas: this.defaults.gas,
				gasPrice: this.defaults.gasPrice
			},
			this.host,
			this.port,
			false
		);
	}
}
