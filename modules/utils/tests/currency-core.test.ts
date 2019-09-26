import BN from 'bignumber.js';

import Currency, { IUnits } from '../src/Currency';

const toAttoCases = [
	{ input: '12312123123a', output: '12312123123a' },
	{ input: '0.2f', output: '200a' },
	{ input: '1f', output: '1000a' },
	{ input: '1.2p', output: '1200000a' },
	{ input: '1.23n', output: '1230000000a' },
	{ input: '1.2u', output: '1200000000000a' },
	{ input: '1.2m', output: '1200000000000000a' },
	{ input: '1.2T', output: '1200000000000000000a' },
	{ input: '1200T', output: '1200000000000000000000a' },
	{ input: '1200000T', output: '1200000000000000000000000a' }
];

describe('toAtto', () => {
	for (const c of toAttoCases) {
		it(`should convert ${c.input} to ${c.output}`, () => {
			const a = new Currency(c.input).format('a');

			expect(a).toBe(c.output);
		});
	}
});

const commaCases = [
	{ input: '1f', output: '1,000a' },
	{ input: '1.2p', output: '1,200,000a' },
	{ input: '1.23n', output: '1,230,000,000a' },
	{ input: '1.2u', output: '1,200,000,000,000a' },
	{ input: '1.2m', output: '1,200,000,000,000,000a' },
	{ input: '1.2T', output: '1,200,000,000,000,000,000a' },
	{ input: '1200T', output: '1,200,000,000,000,000,000,000a' },
	{ input: '1200000T', output: '1,200,000,000,000,000,000,000,000a' },
	{ input: '0.2f', output: '200a' }
];

describe('commaSeperate', () => {
	for (const c of commaCases) {
		it(`should convert ${c.input} to ${c.output}`, () => {
			const a = new Currency(c.input).format('a');
			const r = Currency.commaSeperate(a);

			expect(r).toBe(c.output);
		});
	}
});

const toUnitTokenCases = [
	{ input: '1200000000000000000000000a', output: '1200000T' },
	{ input: '12T', output: '12T' },
	{ input: '1200u', output: '0.0012T' },
	{ input: '12.42u', output: '0.00001242T' }
];

describe('toUnitToken', () => {
	for (const c of toUnitTokenCases) {
		it(`should convert ${c.input} to ${c.output}`, () => {
			const a = new Currency(c.input).format('T');

			expect(a).toBe(c.output);
		});
	}
});

const BNCases: Array<{
	bn: BN;
	to: IUnits;
	expected: string;
}> = [
	{ bn: new BN('1337000000000000000000'), to: 'T', expected: '1337T' },
	{ bn: new BN('1337000000000000000000'), to: 'm', expected: '1337000m' },
	{
		bn: new BN('1337000000000000000000'),
		to: 'u',
		expected: '1337000000u'
	},
	{
		bn: new BN('1337000000000000000000'),
		to: 'n',
		expected: '1337000000000n'
	},
	{
		bn: new BN('1337000000000000000000'),
		to: 'p',
		expected: '1337000000000000p'
	},
	{
		bn: new BN('1337000000000000000000'),
		to: 'f',
		expected: '1337000000000000000f'
	},
	{
		bn: new BN('1337000000000000000000'),
		to: 'a',
		expected: '1337000000000000000000a'
	}
];

describe('convert', () => {
	for (const c of BNCases) {
		it(`should convert 1337000000000000000000(BN) to ${c.expected}`, () => {
			const a = new Currency(c.bn).format(c.to);

			expect(a).toBe(c.expected);
		});
	}
});

// Simple addition, multiplication and subtraction of Currency module
