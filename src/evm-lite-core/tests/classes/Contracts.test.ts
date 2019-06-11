import Defaults from '../vars';

import { EVMLC } from '../../src';

let contract: any;
let evmlc: EVMLC;

describe('Contracts.ts', () => {
	beforeEach(() => {
		evmlc = new EVMLC(Defaults.HOST, Defaults.POST, {
			from: Defaults.FROM,
			gas: Defaults.GAS,
			gasPrice: Defaults.GAS_PRICE
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
