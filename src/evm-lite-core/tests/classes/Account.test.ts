import Defaults from '../vars';

import { Account, EVMLC, V3JSONKeyStore } from '../../src';

let evmlc: EVMLC;

let account: Account;
let decrypted: Account;
let encrypted: V3JSONKeyStore;

describe('Account.ts', () => {
	beforeEach(() => {
		evmlc = new EVMLC(Defaults.HOST, Defaults.POST, {
			from: Defaults.FROM,
			gas: Defaults.GAS,
			gasPrice: Defaults.GAS_PRICE
		});
	});

	it('should create a new account', async () => {
		account = evmlc.accounts.create();

		expect(account.privateKey).not.toBe(undefined);

		expect(account.signTransaction).toBeInstanceOf(Function);
	});

	it('should encrypt an account', async () => {
		encrypted = account.encrypt('asd');

		expect(encrypted).not.toBe(undefined);

		expect(encrypted.crypto).not.toBe(undefined);
	});

	it('should decrypt an account', async () => {
		decrypted = evmlc.accounts.decrypt(encrypted, 'asd');

		expect(account.privateKey).not.toBe(undefined);

		expect(account.signTransaction).toBeInstanceOf(Function);
	});

	it('should sign a transaction', async () => {
		const transaction = await evmlc.accounts.prepareTransfer(
			'0xa45fcfdf304fd82da69c88275e4f4b750ce582ac',
			1
		);

		const parsed = transaction.parse();

		expect(transaction.signedTX).toBe(undefined);

		const signed = (await transaction.sign(account)).signedTX!;

		expect(signed).not.toBe(undefined);

		expect(signed.rawTransaction).not.toBe(undefined);
	});
});
