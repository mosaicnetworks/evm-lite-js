import BN from 'bn.js';

// @ts-ignore
import removeTrailingZeros from 'remove-trailing-zeros';

// test
/* 
    All letters are lowercase except for T for Tenom
    1 / 1 000 000 000 000 000 000			atto		(a)	10^-18
    1 / 1 000 000 000 000 000				femto 		(f)	10^-15
    1 / 1 000 000 000 000					pico		(p)	10^-12
    1 / 1 000 000 000						nano		(n)	10^-9
    1 / 1 000 000							micro		(u)	10^-6
    1 / 1 000								milli		(m)	10^-3
    1									    Tenom		(T)	1
*/

export type Units = 'a' | 'f' | 'p' | 'n' | 'u' | 'm' | 'T';

// ordered units... low -> high
export const units = ['a', 'f', 'p', 'n', 'u', 'm', 'T'];

export const delimiters = {
	thousand: ',',
	decimal: '.'
};

const cleanCurrencyString = (s: string): string => {
	return s
		.replace(/\s/g, '')
		.replace(/,/g, '')
		.trim();
};

export const toAtto = (v: string) => {
	// remove all whitespaces and seperators
	v = cleanCurrencyString(v);

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
};

export const toToken = (v: string) => {
	// remove all whitespaces and seperators
	v = cleanCurrencyString(v);

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

	let multIdx = 18 - idx * 3;

	// remove unit from currency string
	v = v.slice(0, -1);

	// find decimal place
	const l = v.split(delimiters.decimal);

	if (l.length > 2) {
		throw Error('Too many decimal points detected');
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
		l[0] = l[0].slice(0, l[0].length - multIdx);
		multIdx = 0;

		res = l.join('');
	}

	return removeTrailingZeros(res);
};

export const commaSeperate = (s: string) => {
	return s.replace(/(.)(?=(\d{3})+$)/g, `$1${delimiters.thousand}`);
};

export const convertCurrency = (bn: BN, to: Units) => {
	// starting unit is always a BN due `evm-lite` always
	// returning balance in atto tokens
	const s = bn.toString(10);

	// check if currency exists
	// the unit to conver too
	const toUnitIdx = units.indexOf(to);
	if (toUnitIdx < 0) {
		throw Error(`Unrecognized unit: ${to}`);
	}

	let multIdx = toUnitIdx * 3;

	const l = s.split(delimiters.decimal);

	if (l.length > 2) {
		throw Error('Too many decimal points detected');
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
		l[0] = l[0].slice(0, l[0].length - multIdx);
		multIdx = 0;

		res = l.join('');
	}

	return removeTrailingZeros(res) + '';
};
