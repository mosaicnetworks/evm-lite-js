// @ts-ignore
import * as Accounts from 'web3-eth-accounts';
// @ts-ignore
import { Account as Web3Account } from 'web3-eth-accounts';

import { BaseAccount } from '../..';
import { parseTransaction } from '../types';

import Transaction, { ParsedTX, SignedTransaction, TX } from './Transaction';

export interface KDFEncryption {
	ciphertext: string;
	ciperparams: {
		iv: string;
	};
	cipher: string;
	kdf: string;
	kdfparams: {
		dklen: number;
		salt: string;
		n: number;
		r: number;
		p: number;
	};
	mac: string;
}

export interface V3JSONKeyStore {
	version: number;
	id: string;
	address: string;
	crypto: KDFEncryption;
}

const randomHex = require('crypto-random-hex');

export default class Account {
	get address(): string {
		return this.account.address;
	}

	get privateKey(): string {
		return this.account.privateKey;
	}

	public static decrypt(v3JSONKeyStore: V3JSONKeyStore, password: string) {
		const account = new Accounts().decrypt(v3JSONKeyStore, password);
		return new Account(account);
	}

	public balance: number = 0;
	public nonce: number = 0;
	private readonly account: Web3Account;

	constructor(data?: Web3Account) {
		if (!data) {
			this.account = new Accounts().create(randomHex(32));
		} else {
			this.account = data;
		}
	}

	public sign(message: string): any {
		return this.account.sign!(message);
	}

	public signTransaction(tx: TX | Transaction): Promise<SignedTransaction> {
		if (tx instanceof Transaction) {
			const transaction = tx.toJSON();

			if (!transaction.nonce) {
				tx.nonce(this.nonce);
			}

			if (!transaction.chainId) {
				tx.chainID(transaction.chainId || 1);
			}

			return this.account.signTransaction!(
				// @ts-ignore
				parseTransaction(tx.toJSON())
			);
		}

		tx.nonce = tx.nonce || this.nonce;
		tx.chainId = tx.chainId || 1;

		return this.account.signTransaction!(
			// @ts-ignore
			parseTransaction(tx)
		);
	}

	public encrypt(password: string): V3JSONKeyStore {
		// @ts-ignore
		return this.account.encrypt!(password);
	}

	public toBaseAccount(): BaseAccount {
		return {
			address: this.address,
			balance: this.balance,
			nonce: this.nonce
		};
	}
}
