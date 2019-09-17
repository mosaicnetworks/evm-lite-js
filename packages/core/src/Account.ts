// @ts-ignore
import * as ethlib from 'eth-lib';
// @ts-ignore
import * as EthLibAccount from 'eth-lib/lib/account';

import utils, { Currency } from 'evm-lite-utils';

import { ISignedTx, ITransaction } from './Transaction';

import Formatters from './account/formatters';

export interface IAccount {
	// keypair
	address: string;
	privateKey: string;

	// account data
	balance: Currency;
	nonce: number;

	// sign transaction method
	signTx: (tx: ITransaction) => ISignedTx;
}

export default class Account implements IAccount {
	/**
	 * Creates an `Account` object for the given private key hex.
	 *
	 * @param privateKey - The private key hex
	 *
	 * @returns The account object representing the private key
	 */
	public static fromPrivateKey(privateKey: string) {
		privateKey = utils.cleanAddress(privateKey);

		const account = new Account(EthLibAccount.fromPrivate(privateKey));
		account.balance = new Currency(0);

		return account;
	}

	/**
	 * Creates an account key pair.
	 *
	 * @param entropy - A random seed used to generate the account
	 *
	 * @returns A newly created `Account` object
	 */
	public static new(entropy?: string): Account {
		const randomHex = require('crypto-random-hex');

		return new Account(EthLibAccount.create(entropy || randomHex(32)));
	}

	public readonly address: string;
	public readonly privateKey: string;

	public balance: Currency = new Currency(0);
	public nonce: number = 0;

	constructor({
		address,
		privateKey
	}: {
		address: string;
		privateKey: string;
	}) {
		this.address = address;
		this.privateKey = privateKey;
	}

	/**
	 * Signs a transaction with the respective account.
	 *
	 * @param tx - The transaction to sign
	 *
	 * @returns The signed object
	 */
	public signTx(tx: ITransaction): ISignedTx {
		let error: Error | null = null;
		let result;

		if (!tx) {
			error = new Error('No transaction object given!');
			throw error;
		}

		if (!tx.gas) {
			error = new Error('Gas is missing');
		}

		if (
			(tx.nonce && tx.nonce < 0) ||
			tx.gas < 0 ||
			tx.gasPrice < 0 ||
			(tx.chainId && tx.chainId < 0)
		) {
			error = new Error(
				'Gas, GasPrice, Nonce or ChainId is lower than 0'
			);
		}

		if (error) {
			throw error;
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

			rawTx[6] = utils.makeEven(utils.trimLeadingZero(rawTx[6]));
			rawTx[7] = utils.makeEven(utils.trimLeadingZero(rawTx[7]));
			rawTx[8] = utils.makeEven(utils.trimLeadingZero(rawTx[8]));

			const rawTransaction = ethlib.RLP.encode(rawTx);
			const values = ethlib.RLP.decode(rawTransaction);

			result = {
				messageHash: hash,
				v: utils.trimLeadingZero(values[6]),
				r: utils.trimLeadingZero(values[7]),
				s: utils.trimLeadingZero(values[8]),
				rawTransaction
			};
		} catch (error) {
			throw error;
		}

		return result;
	}
}
