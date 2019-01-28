// @ts-ignore
import * as Accounts from 'web3-eth-accounts';

import AccountClient from '../client/AccountClient';

import Account, { V3JSONKeyStore } from './Account';

export default class Wallet extends AccountClient {
	public static decrypt(v3JSONKeyStore: V3JSONKeyStore, password: string) {
		const account = new Accounts().decrypt(v3JSONKeyStore, password);

		return new Account(account);
	}

	constructor(host: string, port: number) {
		super(host, port);
	}

	public add() {
		// pass
	}

	public remove() {
		// pass
	}

	public clear() {
		// pass
	}

	public encrypt() {
		// pass
	}
}
