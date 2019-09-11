import { commaSeperate, toAtto } from '../src/currency';

const expandCases = [
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

describe('unitStringToAttoms', () => {
	for (const c of expandCases) {
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
