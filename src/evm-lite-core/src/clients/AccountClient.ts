import * as JSONBig from 'json-bigint';

import AbstractClient from './AbstractClient';

export interface BaseAccount {
	address: string;
	nonce: number;
	balance: any;
}

export default class AccountClient extends AbstractClient {
	constructor(host: string, port: number) {
		super(host, port);
	}

	public async getAccount(address: string): Promise<BaseAccount> {
		const response = await this.get(`/account/${address}`);
		const account = JSONBig.parse(response) as BaseAccount;

		if (typeof account.balance === 'object') {
			account.balance = account.balance.toFormat(0);
		}

		return account;
	}

	public async getAccounts(): Promise<BaseAccount[]> {
		const response = await this.get('/accounts');
		const json = JSONBig.parse(response) as {
			accounts: BaseAccount[];
		};

		if (json.accounts) {
			return json.accounts.map((account: BaseAccount) => {
				if (typeof account.balance === 'object') {
					account.balance = account.balance.toFormat(0);
				}
				return account;
			});
		} else {
			return [];
		}
	}
}
