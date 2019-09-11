import { commaSeperate, toAtto, toUnitToken } from '../src/currency';

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
			const a = toUnitToken(c.input);

			expect(a.length).toBe(c.output.length);
			expect(a).toBe(c.output);
		});
	}
});
