import evmlc from '../setup';

describe('Contracts.ts', () => {
	describe('constructor', () => {
		it('should have the defaults passed down from root EVMLC', () => {
			const defaultFrom = evmlc.defaultFrom;

			expect(evmlc.contracts.defaults.from).toBe(evmlc.defaultFrom);
			expect(evmlc.contracts.defaults.gas).toBe(evmlc.defaultGas);
			expect(evmlc.contracts.defaults.gasPrice).toBe(
				evmlc.defaultGasPrice
			);

			evmlc.defaultFrom = 'ASD';
			evmlc.defaultGas = 9999;
			evmlc.defaultGasPrice = 12;

			expect(evmlc.contracts.defaults.from).toBe('ASD');
			expect(evmlc.contracts.defaults.gas).toBe(9999);
			expect(evmlc.contracts.defaults.gasPrice).toBe(12);

			evmlc.defaultFrom = defaultFrom;
			evmlc.defaultGas = 1000000;
			evmlc.defaultGasPrice = 0;
		});
	});

	describe('load()', () => {
		it('should have the defaults passed from controller', async () => {
			const contract = await evmlc.contracts.load([]);

			expect(contract.options.from.value).toBe(evmlc.defaultFrom);
			expect(contract.options.gas).toBe(evmlc.defaultGas);
			expect(contract.options.gasPrice).toBe(evmlc.defaultGasPrice);
		});
	});
});
