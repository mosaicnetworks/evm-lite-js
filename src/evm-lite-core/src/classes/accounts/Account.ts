// @ts-ignore
import * as ethlib from 'eth-lib';
import * as Utils from 'web3-utils';

import Formatters from '../../utils/Formatters';

import { BaseAccount } from '../../clients/AccountClient';

import Transaction, { SignedTransaction, TX } from '../transaction/Transaction';

import EVM from '../../types';

export interface V3JSONKeyStore {
	version: number;
	id: string;
	address: string;
	crypto: {
		ciphertext: string;
		cipherparams: { iv: string };
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
	};
}

const trimLeadingZero = (hex: string) => {
	while (hex && hex.startsWith('0x0')) {
		hex = `0x${hex.slice(3)}`;
	}
	return hex;
};

const makeEven = (hex: string) => {
	if (hex.length % 2 === 1) {
		hex = hex.replace('0x', '0x0');
	}

	return hex;
};

export interface Web3Account {
	address: EVM.Address;
	privateKey: string;
	signTransaction: (tx: Transaction) => SignedTransaction;
	sign: (data: string) => {};
	encrypt: (password: string) => V3JSONKeyStore;
}

export default class Account {
	get address(): EVM.Address {
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

	public signTransaction1(tx: TX): Promise<SignedTransaction> {
		tx.nonce = tx.nonce || this.nonce;
		tx.chainId = tx.chainId || 1;

		// @ts-ignore
		return this.account.signTransaction(tx);
	}

	// web3 sign function
	public signTransaction(tx: TX) {
		const _this = this;
		let error: Error | null = null;
		let result;

		if (!tx) {
			error = new Error('No transaction object given!');
			return Promise.reject(error);
		}
		if (!tx.gas) {
			error = new Error('gas is missing');
		}

		if (
			(tx.nonce && tx.nonce < 0) ||
			tx.gas < 0 ||
			tx.gasPrice < 0 ||
			(tx.chainId && tx.chainId < 0)
		) {
			error = new Error(
				'Gas, gasPrice, nonce or chainId is lower than 0'
			);
		}

		if (error) {
			return Promise.reject(error);
		}

		try {
			const transaction = Formatters.inputCallFormatter(tx);

			transaction.to = transaction.to || '0x';

			const rlpEncoded = ethlib.RLP.encode([
				ethlib.bytes.fromNat(transaction.nonce),
				ethlib.bytes.fromNat(transaction.gasPrice),
				ethlib.bytes.fromNat(transaction.gas),
				transaction.to.toLowerCase(),
				ethlib.bytes.fromNat(transaction.value),
				transaction.data,
				ethlib.bytes.fromNat(transaction.chainId),
				'0x',
				'0x'
			]);

			const hash = ethlib.hash.keccak256(rlpEncoded);

			const signature = ethlib.account.makeSigner(
				ethlib.nat.toNumber(transaction.chainId || '0x1') * 2 + 35
			)(ethlib.hash.keccak256(rlpEncoded), this.privateKey);

			const rawTx = ethlib.RLP.decode(rlpEncoded)
				.slice(0, 6)
				.concat(ethlib.account.decodeSignature(signature));

			rawTx[6] = makeEven(trimLeadingZero(rawTx[6]));
			rawTx[7] = makeEven(trimLeadingZero(rawTx[7]));
			rawTx[8] = makeEven(trimLeadingZero(rawTx[8]));

			const rawTransaction = ethlib.RLP.encode(rawTx);
			const values = ethlib.RLP.decode(rawTransaction);

			result = {
				messageHash: hash,
				v: trimLeadingZero(values[6]),
				r: trimLeadingZero(values[7]),
				s: trimLeadingZero(values[8]),
				rawTransaction
			};
		} catch (error) {
			return Promise.reject(error);
		}

		return result;
	}

	public encrypt(password: string): V3JSONKeyStore {
		// @ts-ignore
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
