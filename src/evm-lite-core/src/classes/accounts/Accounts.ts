import { Accounts as Web3Accounts } from 'web3-eth-accounts';

import Account from './Account';

import { V3JSONKeyStore } from './Account';

export default class Accounts {
	private accounts: Web3Accounts;

	constructor() {
		this.accounts = new Web3Accounts('http://', {
			defaultAccount: '0X0000000000000000000000000000000000000000',
			defaultGas: 0,
			defaultGasPrice: ''
		});
	}

	public decrypt(v3JSONKeyStore: V3JSONKeyStore, password: string) {
		const account = this.accounts.decrypt(v3JSONKeyStore, password);
		return new Account(account);
	}

	public create(hex?: string): Account {
		const randomHex = require('crypto-random-hex');

		return new Account(this.accounts.create(hex || randomHex(32)));
	}
}
