import { Accounts as Web3Accounts } from 'web3-eth-accounts';

import Account from './Account';

import { V3JSONKeyStore } from './Account';

export default class Accounts {
	private accounts: Web3Accounts;

	/**
	 * Accounts controller class to interact with accounts within the EVM.
	 */
	constructor() {
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
}
