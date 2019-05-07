import { Accounts as Web3Accounts } from 'web3-eth-accounts';

import { Address, AddressType, Gas, GasPrice, Value } from '../../types';
import Transaction, { BaseTransaction } from '../transaction/Transaction';
import { V3JSONKeyStore } from './Account';

import AccountClient from '../../clients/AccountClient';
import Account from './Account';

interface AccountDefaultOptions extends BaseTransaction {
	from: Address;
}

export default class Accounts extends AccountClient {
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
		to: string,
		value: Value,
		from?: string
	): Transaction {
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

		return new Transaction(
			{
				from: fromObject,
				to: new AddressType(to.trim()),
				value,
				gas: this.accountOptions.gas,
				gasPrice: this.accountOptions.gasPrice,
				chainId: 1
			},
			this.host,
			this.port,
			false
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

	/**
	 * The default `from` address that will be used for any transactions
	 * created from this object.
	 */
	get defaultFrom(): string {
		return this.accountOptions.from.value;
	}

	/**
	 * Set the default `from` to be used for any transactions created from
	 * this object.
	 */
	set defaultFrom(address: string) {
		this.accountOptions.from = new AddressType(address);
	}

	/**
	 * The default `gas` value that will be used for any transactions created
	 * from this object.
	 */
	get defaultGas(): Gas {
		return this.accountOptions.gas;
	}

	/**
	 * Set the default `gas` value to be used for any transactions created from
	 * this object.
	 */
	set defaultGas(gas: Gas) {
		this.accountOptions.gas = gas;
	}

	/**
	 * The default `gasPrice` value that will be used for any transactions
	 * created from this object.
	 */
	get defaultGasPrice(): GasPrice {
		return this.accountOptions.gasPrice;
	}

	/**
	 * Set the default `gasPrice` to be used for any transactions created from
	 * this object.
	 */
	set defaultGasPrice(gasPrice: GasPrice) {
		this.accountOptions.gasPrice = gasPrice;
	}
}
