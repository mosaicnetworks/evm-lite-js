import evmlc from '../setup';

describe('Accounts.ts', () => {
	describe('constructor', () => {
		it('should have the defaults passed down from root EVMLC', () => {
			const defaultFrom = evmlc.defaultFrom;

			expect(evmlc.accounts.defaults.from).toBe(evmlc.defaultFrom);
			expect(evmlc.accounts.defaults.gas).toBe(evmlc.defaultGas);
			expect(evmlc.accounts.defaults.gasPrice).toBe(
				evmlc.defaultGasPrice
			);

			evmlc.defaultFrom = 'ASD';
			evmlc.defaultGas = 9999;
			evmlc.defaultGasPrice = 12;

			expect(evmlc.accounts.defaults.from).toBe('ASD');
			expect(evmlc.accounts.defaults.gas).toBe(9999);
			expect(evmlc.accounts.defaults.gasPrice).toBe(12);

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
