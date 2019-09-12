import BN from 'bignumber.js';

import { convertCurrency, Units } from 'evm-lite-utils';

class Currency extends BN {
	constructor(number: BN) {
		super(number);
	}

	public format(unit: Units) {
		return convertCurrency(this, unit);
	}
}

export default Currency;
