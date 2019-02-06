import evmlc from '../setup';

import { Transaction } from '../../src';

const defaultFrom = evmlc.defaultFrom;
let transaction: Transaction;
let parsed: any;

describe('Accounts.ts', async () => {
	it('should default gas from EVMLC', async () => {
		expect(evmlc.accounts.defaults.gas).toBe(evmlc.defaultGas);
	});

	it('should default gasPrice from EVMLC', () => {
		expect(evmlc.accounts.defaults.gasPrice).toBe(evmlc.defaultGasPrice);
	});

	it('should default from from EVMLC', () => {
		expect(evmlc.accounts.defaults.from).toBe(evmlc.defaultFrom);
	});

	it('should have the default gas from `EVMLC` after change', () => {
		evmlc.defaultFrom = 'ASD';
		evmlc.defaultGas = 9999;
		evmlc.defaultGasPrice = 12;

		expect(evmlc.accounts.defaults.gas).toBe(9999);
	});

	it('should have the default gasPrice from `EVMLC` after change', () => {
		expect(evmlc.accounts.defaults.gasPrice).toBe(12);
	});

	it('should have the default `from` from `EVMLC` after change', () => {
		expect(evmlc.accounts.defaults.from).toBe('ASD');

		evmlc.defaultFrom = defaultFrom;
		evmlc.defaultGas = 1000000000;
		evmlc.defaultGasPrice = 0;
	});

	it('transaction has default gas', async () => {
		transaction = await evmlc.accounts.prepareTransfer('SOME_ADDRESS', 200);
		parsed = transaction.parse();

		expect(parsed.gas).toBe(evmlc.accounts.defaultGas);
	});

	it('transaction has default gasPrice', async () => {
		expect(parsed.gasPrice).toBe(evmlc.accounts.defaultGasPrice);
	});

	it('transaction has default from', async () => {
		expect(parsed.from).toBe(evmlc.accounts.defaultFrom.toLowerCase());
	});
});
