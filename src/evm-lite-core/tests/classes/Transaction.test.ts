import { EVMLC, Transaction } from '../../src';

let evmlc: EVMLC;
let transaction: Transaction;
let parsed: any;
let details: any;

describe('Transaction.ts', () => {
	beforeEach(async () => {
		evmlc = new EVMLC('127.0.0.1', 8080, {
			from: '0X5E54B1907162D64F9C4C7A46E3547084023DA2A0',
			gas: 10000000,
			gasPrice: 0
		});

		transaction = await evmlc.accounts.prepareTransfer(
			'0X4F44B1907162D64F9C4C7A46E3547084023DA2A0',
			200
		);
		parsed = transaction.parse();
		details = transaction.details();
	});

	it('should parse `from` to native JS types', () => {
		expect(parsed.from.toUpperCase()).toBe(details.from.value);
	});

	it('should parse `to` to native JS types', () => {
		expect(parsed.to.toUpperCase()).toBe(details.to.value);
	});

	it('should sign a transaction', async () => {
		const account = evmlc.accounts.create();

		expect(transaction.signedTX).toBe(undefined);

		await transaction.sign(account);

		expect(transaction.signedTX).not.toBe(undefined);

		expect(transaction.signedTX!.rawTransaction).not.toBe(undefined);
	});
});
