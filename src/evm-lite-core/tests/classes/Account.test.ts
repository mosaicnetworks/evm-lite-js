import { Account, V3JSONKeyStore } from 'evm-lite-core';

import evmlc, { assert } from '../setup';

let account: Account;
let decrypted: Account;
let encrypted: V3JSONKeyStore;

describe('Account.ts', () => {
	it('should create a new account', async () => {
		account = evmlc.accounts.create();

		assert.notEqual(
			account.privateKey,
			undefined,
			'account privatekey should be exposed'
		);
		assert.notEqual(
			account.signTransaction,
			undefined,
			'account sign transaction function should also be exposed'
		);
	});

	it('should encrypt an account', async () => {
		encrypted = account.encrypt('asd');

		assert.notEqual(
			encrypted,
			undefined,
			'encrypted keystore should be valid'
		);
		assert.notEqual(
			encrypted.crypto,
			undefined,
			'cryptography params should be validd'
		);
	});

	it('should decrypt an account', async () => {
		decrypted = evmlc.accounts.decrypt(encrypted, 'asd');

		assert.notEqual(
			account.privateKey,
			undefined,
			'account privatekey should be exposed'
		);
		assert.notEqual(
			account.signTransaction,
			undefined,
			'account sign transaction function should also be exposed'
		);
	});

	it('should sign a transaction', async () => {
		const transaction = await evmlc.prepareTransfer(
			'0xa45fcfdf304fd82da69c88275e4f4b750ce582ac',
			1
		);

		assert.equal(
			transaction.parse().from,
			evmlc.defaultFrom.toLowerCase(),
			'`from` address should automatically be passed on from parent obj'
		);
		assert.equal(
			transaction.signedTX,
			undefined,
			'signed transaction value should be undefined'
		);

		const signed = await decrypted.signTransaction(transaction.parse());

		assert.notEqual(
			signed,
			undefined,
			'signed transaction should be generated'
		);
		assert.notEqual(
			signed.rawTransaction,
			undefined,
			'signed raw transaction should be valid'
		);
	});
});
