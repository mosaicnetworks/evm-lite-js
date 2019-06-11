import Account from '../src/Account';

let account: Account;

describe('Account.ts', () => {
	it('should create a new account', async () => {
		account = Account.create();

		expect(account.address.slice(0, 2)).toBe('0x');
		expect(account.address.length).toBe(42);
		expect(account.privateKey).not.toBe(undefined);
		expect(typeof account.signTransaction).toBe('function');
	});

	it('should generate account with private key', async () => {
		const privAccount = Account.fromPrivateKey(account.privateKey);

		expect(privAccount.address.slice(0, 2)).toBe('0x');
		expect(privAccount.address).toBe(account.address);
		expect(account.address.length).toBe(42);
		expect(account.privateKey).not.toBe(undefined);
	});

	it('should sign a transaction correctly', () => {
		const secondAccount = Account.create();
		const transaction = Account.prepareTransfer(
			account.address,
			secondAccount.address,
			1,
			10000000,
			0
		);

		transaction.nonce = 1;

		const signed = account.signTransaction(transaction);

		expect(signed.messageHash).not.toBe(undefined);
		expect(signed.v).not.toBe(undefined);
		expect(signed.r).not.toBe(undefined);
		expect(signed.s).not.toBe(undefined);
		expect(signed.rawTransaction).not.toBe(undefined);
	});
});
