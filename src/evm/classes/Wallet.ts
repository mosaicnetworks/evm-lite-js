// @ts-ignore
import * as Accounts from 'web3-eth-accounts';

import AccountClient from '../client/AccountClient';

export default class Wallet extends AccountClient {
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
