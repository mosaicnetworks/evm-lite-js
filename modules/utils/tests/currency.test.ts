import BN from 'bignumber.js';

import Currency, { IUnits } from '../src/Currency';

describe('Bignumber arithmetic', () => {
	it('should multipliedBy and times return the same number', () => {
		const am1 = Currency.Token.times(400);
		const am2 = Currency.Token.multipliedBy(400);

		expect(am1.toString(10)).toBe(am2.toString(10));
	});
});
