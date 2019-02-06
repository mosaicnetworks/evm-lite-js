import { EVMLC, Transaction } from '../../src';

let evmlc: EVMLC;
let transaction: Transaction;
let parsed: any;

describe('Accounts.ts', async () => {
	beforeEach(() => {
		evmlc = new EVMLC('127.0.0.1', 8080, {
			from: '0X5E54B1907162D64F9C4C7A46E3547084023DA2A0',
			gas: 10000000,
			gasPrice: 0
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

		expect(evmlc.accounts.defaults.from).toBe('ASD');
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
