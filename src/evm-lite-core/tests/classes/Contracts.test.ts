import { EVMLC } from '../../src';

let contract: any;
let evmlc: EVMLC;

describe('Contracts.ts', () => {
	beforeEach(() => {
		evmlc = new EVMLC('n0.monet.network', 8080, {
			from: '0X5E54B1907162D64F9C4C7A46E3547084023DA2A0',
			gas: 10000000,
			gasPrice: 0
		});
	});

	it('contract should have default gas', async () => {
		contract = evmlc.contracts.load([]);

		expect(contract.contractOptions.gas).toBe(evmlc.defaultGas);
	});

	it('contract should have default gasPrice', async () => {
		expect(contract.contractOptions.gasPrice).toBe(evmlc.defaultGasPrice);
	});

	it('contract should have default from', async () => {
		expect(contract.contractOptions.from).toBe(evmlc.defaultFrom);
	});
});
