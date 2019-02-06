import evmlc from '../setup';

describe('Accounts.ts', () => {
	describe('constructor', () => {
		const defaultFrom = evmlc.defaultFrom;

		it('should default gas from EVMLC', () => {
			expect(evmlc.accounts.defaults.gas).toBe(evmlc.defaultGas);
		});

		it('should default gasPrice from EVMLC', () => {
			expect(evmlc.accounts.defaults.gasPrice).toBe(
				evmlc.defaultGasPrice
			);
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
			evmlc.defaultGas = 1000000;
			evmlc.defaultGasPrice = 0;
		});
	});

	describe('prepareTransfer()', async () => {
		const transaction = await evmlc.accounts.prepareTransfer(
			'SOME_ADDRESS',
			200
		);
		const parsed = transaction.parse();

		it('transaction has default gas', async () => {
			expect(parsed.gas).toBe(evmlc.defaultGas);
		});

		it('transaction has default gasPrice', async () => {
			expect(parsed.gasPrice).toBe(evmlc.defaultGasPrice);
		});

		it('transaction has default from', async () => {
			expect(parsed.from).toBe(evmlc.defaultFrom.toLowerCase());
		});
	});
});
