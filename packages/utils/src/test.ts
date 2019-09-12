import BN from 'bignumber.js';

import Currency from './Currency';

const c1 = new Currency(new BN('1337000000000000000000'));
const c2 = new Currency(new BN('1336000000000000000000'));

console.log(c1.minus(c2));
