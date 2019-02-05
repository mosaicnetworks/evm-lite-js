import { Accounts, EncryptedKeystoreV3Json } from 'web3-eth-accounts';

import { BaseAccount } from '../../clients/AccountClient';

import Transaction, {
	ParsedTransaction,
	SignedTransaction,
	TX
} from '../transaction/Transaction';

export type V3JSONKeyStore = EncryptedKeystoreV3Json;

export interface Web3Account {
	address: string;
	privateKey: string;
	signTransaction: (tx: Transaction) => SignedTransaction;
	sign: (data: string) => {};
	encrypt: (password: string) => V3JSONKeyStore;
}

export default class Account {
	get address(): string {
		return this.account.address;
	}

	get privateKey(): string {
		return this.account.privateKey;
	}

	public balance: number = 0;
	public nonce: number = 0;
	private readonly account: Web3Account;

	constructor(data: Web3Account) {
		this.account = data;
	}

	public sign(message: string): any {
		return this.account.sign(message);
	}

	public signTransaction(tx: ParsedTransaction): Promise<SignedTransaction> {
		tx.nonce = tx.nonce || this.nonce;
		tx.chainId = tx.chainId || 1;

		// @ts-ignore
		return this.account.signTransaction(tx);
	}

	public encrypt(password: string): V3JSONKeyStore {
		return this.account.encrypt(password);
	}

	public toBaseAccount(): BaseAccount {
		return {
			address: this.address,
			balance: this.balance,
			nonce: this.nonce
		};
	}
}
