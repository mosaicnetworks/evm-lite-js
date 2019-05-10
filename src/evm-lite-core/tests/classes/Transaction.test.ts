import Defaults from '../vars';

import { EVMLC, Transaction, TX } from '../../src';

let evmlc: EVMLC;
let transaction: Transaction;
let parsed: any;

describe('Transaction.ts', () => {
	beforeEach(async () => {
		evmlc = new EVMLC(Defaults.HOST, Defaults.POST, {
			from: Defaults.FROM,
			gas: Defaults.GAS,
			gasPrice: Defaults.GAS_PRICE
		});

		transaction = evmlc.accounts.prepareTransfer(
			'0X4F44B1907162D64F9C4C7A46E3547084023DA2A0',
			200
		);

		parsed = transaction.parse();
	});

	it('should parse `from` to native JS types', () => {
		expect(parsed.from).toBe(evmlc.defaultFrom);
	});

	it('should parse `to` to native JS types', () => {
		expect(parsed.to).toBe(
			'0X4F44B1907162D64F9C4C7A46E3547084023DA2A0'.toLowerCase()
		);
	});

	it('should sign a transaction', async () => {
		const account = evmlc.accounts.create();

		expect(transaction.signedTX).toBe(undefined);

		await transaction.sign(account);

		expect(transaction.signedTX).not.toBe(undefined);

		expect(transaction.signedTX!.rawTransaction).not.toBe(undefined);
	});
});
