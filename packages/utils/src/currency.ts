import BN from 'bn.js';

import { convertCurrency, Units } from 'evm-lite-utils';

class Currency extends BN {
	constructor(number: string) {
		super(number);
	}

	public format(unit: Units) {
		return convertCurrency(this, unit);
	}
}

export default Currency;
