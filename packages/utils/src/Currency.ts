// @ts-ignore
import removeTrailingZeros from 'remove-trailing-zeros';

import BN from 'bignumber.js';

import utils from '.';

export type IUnits = 'a' | 'f' | 'p' | 'n' | 'u' | 'm' | 'T';

// ordered units... low -> high
export const units = ['a', 'f', 'p', 'n', 'u', 'm', 'T'];

const delimiters = {
	thousand: ',',
	decimal: '.'
};

class Currency extends BN {
	public static atto = new Currency(1);
	public static femto = new Currency(1000);
	public static pico = new Currency(1000000);
	public static nano = new Currency(1000000000);
	public static micro = new Currency(1000000000000);
	public static milli = new Currency(1000000000000000);
	public static Token = new Currency(1000000000000000000);

	public static commaSeperate(s: string) {
		const u = s.slice(-1);

		if (!utils.isLetter(u)) {
			return s.replace(/(.)(?=(\d{3})+$)/g, `$1${delimiters.thousand}`);
		}

		return (
			s
				.slice(0, -1)
				.replace(/(.)(?=(\d{3})+$)/g, `$1${delimiters.thousand}`) + u
		);
	}

	private static toAtto(value: string) {
		// remove all whitespaces and seperators
		let v = value
			.replace(/\s/g, '')
			.replace(/,/g, '')
			.trim();

		if (!v) {
			throw Error('Currency string cannot be empty');
		}

		// unit is last character of string
		const unit = v.slice(-1);

		// will return -1 if not found else the index
		const idx = units.indexOf(unit);

		if (idx < 0) {
			throw Error(`Unrecognized unit: ${unit}`);
		}

		let multIdx = idx * 3;

		// remove unit from currency string
		v = v.slice(0, -1);

		// find decimal place
		const l = v.split(delimiters.decimal);

		if (l.length > 2) {
			throw Error('Too many decimal points detected');
		}

		if (l[1]) {
			if (l[1].length > multIdx) {
				throw Error('Cannot convert to a fraction of an Atto token');
			}

			multIdx -= l[1].length;
		}

		for (let i = multIdx; i > 0; i--) {
			l.push('0');
		}

		return l.join('').replace(/^0+/, '');
	}

	constructor(value: BN | string | number) {
		if (typeof value === 'string') {
			super(Currency.toAtto(value));
		} else {
			super(value);
		}
	}

	public format(unit: IUnits) {
		return this.convert(unit);
	}

	// Return currency object
	public times(n: BN.Value): Currency {
		const bn = super.times(n, 10);

		return new Currency(bn);
	}

	// Return currency object
	public plus(n: BN.Value): Currency {
		const bn = super.plus(n, 10);

		return new Currency(bn);
	}

	private convert(to: IUnits) {
		// starting unit is always a BN due `evm-lite` always
		// returning balance in atto tokens
		const s = this.toString(10);

		// check if currency exists
		// the unit to conver too
		const toUnitIdx = units.indexOf(to);
		if (toUnitIdx < 0) {
			throw Error(`Unrecognized unit: ${to}`);
		}

		let multIdx = toUnitIdx * 3;

		const l = s.split(delimiters.decimal);
		if (l.length > 1) {
			throw Error('Starting Atto token cannot be fractional');
		}

		let res: string;

		if (l[0].length <= multIdx) {
			multIdx -= l[0].length;

			const rev = l.reverse();

			for (let i = multIdx; i > 0; i--) {
				rev.push('0');
			}

			// add leading zero and decimal
			rev.push('.');
			rev.push('0');

			res = rev.reverse().join('');
		} else {
			const pre = l[0].slice(0, l[0].length - multIdx);
			const post = l[0].slice(l[0].length - multIdx, l[0].length);

			multIdx = 0;

			res = pre + '.' + post;
		}

		return removeTrailingZeros(res) + to;
	}
}

export default Currency;
