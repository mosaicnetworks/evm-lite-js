import Defaults from '../vars';

import { EVMLC, Transaction } from '../../src';

let evmlc: EVMLC;
let transaction: Transaction;
let parsed: any;

describe('Accounts.ts', async () => {
	beforeEach(() => {
		evmlc = new EVMLC(Defaults.HOST, Defaults.POST, {
			from: Defaults.FROM,
			gas: Defaults.GAS,
			gasPrice: Defaults.GAS_PRICE
		});
	});

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
		evmlc.defaultGas = 9999;

		expect(evmlc.accounts.defaults.gas).toBe(9999);
	});

	it('should have the default gasPrice from `EVMLC` after change', () => {
		evmlc.defaultGasPrice = 12;

		expect(evmlc.accounts.defaults.gasPrice).toBe(12);
	});

	it('should have the default `from` from `EVMLC` after change', () => {
		evmlc.defaultFrom = 'ASD';

		expect(evmlc.accounts.defaults.from).toBe('asd');
	});

	it('transaction has default gas', async () => {
		transaction = await evmlc.accounts.prepareTransfer('SOME_ADDRESS', 200);
		parsed = transaction.parse();

		expect(parsed.gas).toBe(evmlc.accounts.defaults.gas);
	});

	it('transaction has default gasPrice', async () => {
		expect(parsed.gasPrice).toBe(evmlc.accounts.defaults.gasPrice);
	});

	it('transaction has default from', async () => {
		expect(parsed.from).toBe(evmlc.accounts.defaults.from);
	});
});
