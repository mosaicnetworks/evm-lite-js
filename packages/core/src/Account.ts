// @ts-ignore
import * as ethlib from 'eth-lib';
// @ts-ignore
import * as EthLibAccount from 'eth-lib/lib/account';

import utils from 'evm-lite-utils';

import { BaseAccount } from './client/AbstractClient';

import Formatters from './misc/formatters';
import Transaction, { SignedTransaction, TX } from './Transaction';

import EVMTypes from './misc/types';

const trimLeadingZero = (hex: string) => {
	while (hex.startsWith('0x0')) {
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

export default class Account {
	/**
	 * Creates an `Account` object for the given private key hex.
	 *
	 * @param privateKey - The private key hex
	 *
	 * @returns The account object representing the private key
	 */
	public static fromPrivateKey(privateKey: string) {
		privateKey = utils.cleanAddress(privateKey);

		return new Account(EthLibAccount.fromPrivate(privateKey));
	}

	/**
	 * Creates an account key pair.
	 *
	 * @param entropy - A random seed used to generate the account
	 *
	 * @returns A newly created `Account` object
	 */
	public static create(entropy?: string): Account {
		const randomHex = require('crypto-random-hex');

		return new Account(EthLibAccount.create(entropy || randomHex(32)));
	}

	/**
	 * Generates a transaction to transfer funds from one address to
	 * another.
	 *
	 * @param from - The address to deduct `value` tokens from
	 * @param to - The address to transfer `value` tokens to
	 * @param value - The number of tokens to transfer
	 * @param gas - The max `gas` limit
	 * @param gasPrice - The `gasPrice` per unit of `gas`
	 *
	 * @returns A transaction object represeting the requested transfer
	 */
	public static prepareTransfer(
		from: EVMTypes.Address,
		to: EVMTypes.Address,
		value: EVMTypes.Value,
		gas: EVMTypes.Gas,
		gasPrice: EVMTypes.GasPrice
	): Transaction {
		if (!from) {
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
				from,
				to: to.trim(),
				value,
				gas,
				gasPrice
			},
			false
		);
	}

	public readonly address: EVMTypes.Address;
	public readonly privateKey: string;

	public balance: number = 0;
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
	 * Signs a transaction
	 *
	 * @param tx - The transaction to sign
	 *
	 * @returns The signed object
	 */
	public signTransaction(tx: TX): SignedTransaction {
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
			throw error;
		}

		return result;
	}

	/**
	 * Converts `this` object to a compact overview of the account.
	 *
	 * @returns A compact representation of the `Account` object
	 */
	public toBaseAccount(): BaseAccount {
		return {
			address: this.address,
			balance: this.balance,
			nonce: this.nonce,
			bytecode: ''
		};
	}
}
