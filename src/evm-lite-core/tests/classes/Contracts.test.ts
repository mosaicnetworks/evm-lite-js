import evmlc from '../setup';

let contract: any;

describe('Contracts.ts', () => {
	const defaultFrom = evmlc.defaultFrom;

	it('should have the default gas from `EVMLC`', () => {
		expect(evmlc.contracts.defaults.gas).toBe(evmlc.defaultGas);
	});

	it('should have the default gasPrice from `EVMLC`', () => {
		expect(evmlc.contracts.defaults.gasPrice).toBe(evmlc.defaultGasPrice);
	});

	it('should have the default `from` from `EVMLC`', () => {
		expect(evmlc.contracts.defaults.from).toBe(evmlc.defaultFrom);
	});

	it('should have the default gas from `EVMLC` after change', () => {
		evmlc.defaultFrom = 'ASD';
		evmlc.defaultGas = 9999;
		evmlc.defaultGasPrice = 12;

		expect(evmlc.contracts.defaults.gas).toBe(9999);
	});

	it('should have the default gasPrice from `EVMLC` after change', () => {
		expect(evmlc.contracts.defaults.gasPrice).toBe(12);
	});

	it('should have the default `from` from `EVMLC` after change', () => {
		expect(evmlc.contracts.defaults.from).toBe('ASD');

		evmlc.defaultFrom = defaultFrom;
		evmlc.defaultGas = 1000000;
		evmlc.defaultGasPrice = 0;
	});

	it('contract should have default gas', async () => {
		contract = await evmlc.contracts.load([]);

		expect(contract.options.gas).toBe(evmlc.defaultGas);
	});

	it('contract should have default gasPrice', async () => {
		expect(contract.options.gasPrice).toBe(evmlc.defaultGasPrice);
	});

	it('contract should have default from', async () => {
		expect(contract.options.from.value).toBe(evmlc.defaultFrom);
	});
});
