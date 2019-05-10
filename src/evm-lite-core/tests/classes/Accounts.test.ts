import { EVMLC, Transaction } from '../../src';

let evmlc: EVMLC;

describe('Accounts.ts', async () => {
	beforeEach(() => {
		evmlc = new EVMLC('n0.monet.network', 8080, {
			from: '0X5E54B1907162D64F9C4C7A46E3547084023DA2A0',
			gas: 10000000,
			gasPrice: 0
		});
	});
});
