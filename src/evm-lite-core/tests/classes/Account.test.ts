import { Account, EVMLC, V3JSONKeyStore } from '../../src';

let evmlc: EVMLC;

let account: Account;
let decrypted: Account;
let encrypted: V3JSONKeyStore;

describe('Account.ts', () => {
	beforeEach(() => {
		evmlc = new EVMLC('127.0.0.1', 8080, {
			from: '0X5E54B1907162D64F9C4C7A46E3547084023DA2A0',
			gas: 10000000,
			gasPrice: 0
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

		const signed = await decrypted.signTransaction(transaction.parse());

		expect(signed).not.toBe(undefined);

		expect(signed.rawTransaction).not.toBe(undefined);
	});
});
