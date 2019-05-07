import { EVMLC } from '../../src';

let contract: any;
let evmlc: EVMLC;

describe('Contracts.ts', () => {
	beforeEach(() => {
		evmlc = new EVMLC('127.0.0.1', 8080, {
			from: '0X5E54B1907162D64F9C4C7A46E3547084023DA2A0',
			gas: 10000000,
			gasPrice: 0
		});
	});

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
		evmlc.defaultGas = 9999;

		expect(evmlc.contracts.defaults.gas).toBe(9999);
	});

	it('should have the default gasPrice from `EVMLC` after change', () => {
		evmlc.defaultGasPrice = 12;

		expect(evmlc.contracts.defaults.gasPrice).toBe(12);
	});

	it('should have the default `from` from `EVMLC` after change', () => {
		evmlc.defaultFrom = 'ASD';

		expect(evmlc.contracts.defaults.from).toBe('ASD');
	});

	it('contract should have default gas', async () => {
		contract = evmlc.contracts.load([]);

		expect(contract.contractOptions.gas).toBe(evmlc.defaultGas);
	});

	it('contract should have default gasPrice', async () => {
		expect(contract.contractOptions.gasPrice).toBe(evmlc.defaultGasPrice);
	});

	it('contract should have default from', async () => {
		expect(contract.contractOptions.from.value).toBe(evmlc.defaultFrom);
	});
});
