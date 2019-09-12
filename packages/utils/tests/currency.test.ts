import BN from 'bn.js';

import {
	commaSeperate,
	convert,
	Currency,
	toAtto,
	toToken
} from '../src/currency';

const toAttoCases = [
	{ input: '12312123123a', output: '12312123123' },
	{ input: '0.2f', output: '200' },
	{ input: '1f', output: '1000' },
	{ input: '1.2p', output: '1200000' },
	{ input: '1.23n', output: '1230000000' },
	{ input: '1.2u', output: '1200000000000' },
	{ input: '1.2m', output: '1200000000000000' },
	{ input: '1.2T', output: '1200000000000000000' },
	{ input: '1200T', output: '1200000000000000000000' },
	{ input: '1200000T', output: '1200000000000000000000000' }
];

describe('toAtto', () => {
	for (const c of toAttoCases) {
		it(`should convert ${c.input} to ${c.output}`, () => {
			const a = toAtto(c.input);

			expect(a.length).toBe(c.output.length);
			expect(a).toBe(c.output);
		});
	}
});

const commaCases = [
	{ input: '1f', output: '1,000' },
	{ input: '1.2p', output: '1,200,000' },
	{ input: '1.23n', output: '1,230,000,000' },
	{ input: '1.2u', output: '1,200,000,000,000' },
	{ input: '1.2m', output: '1,200,000,000,000,000' },
	{ input: '1.2T', output: '1,200,000,000,000,000,000' },
	{ input: '1200T', output: '1,200,000,000,000,000,000,000' },
	{ input: '1200000T', output: '1,200,000,000,000,000,000,000,000' },
	{ input: '0.2f', output: '200' }
];

describe('commaSeperate', () => {
	for (const c of commaCases) {
		it(`should convert ${c.input} to ${c.output}`, () => {
			const a = toAtto(c.input);
			const r = commaSeperate(a);

			expect(r).toBe(c.output);
		});
	}
});

const toUnitTokenCases = [
	{ input: '1200000000000000000000000a', output: '1200000' },
	{ input: '12T', output: '12' },
	{ input: '1200u', output: '0.0012' },
	{ input: '12.42u', output: '0.00001242' }
];

describe('toUnitToken', () => {
	for (const c of toUnitTokenCases) {
		it(`should convert ${c.input} to ${c.output}`, () => {
			const a = toToken(c.input);

			expect(a.length).toBe(c.output.length);
			expect(a).toBe(c.output);
		});
	}
});

const BNCases: Array<{
	bn: BN;
	to: Currency;
	expected: string;
}> = [
	{ bn: new BN('1337000000000000000000'), to: 'token', expected: '1337' },
	{ bn: new BN('1337000000000000000000'), to: 'milli', expected: '1337000' },
	{
		bn: new BN('1337000000000000000000'),
		to: 'micro',
		expected: '1337000000'
	},
	{
		bn: new BN('1337000000000000000000'),
		to: 'nano',
		expected: '1337000000000'
	},
	{
		bn: new BN('1337000000000000000000'),
		to: 'pico',
		expected: '1337000000000000'
	},
	{
		bn: new BN('1337000000000000000000'),
		to: 'femto',
		expected: '1337000000000000000'
	},
	{
		bn: new BN('1337000000000000000000'),
		to: 'atto',
		expected: '1337000000000000000000'
	}
];

describe('convert', () => {
	for (const c of BNCases) {
		it(`should convert 1337000000000000000000(BN) to ${c.expected}`, () => {
			const a = convert(c.bn, c.to);

			expect(a).toBe(c.expected);
		});
	}
});
