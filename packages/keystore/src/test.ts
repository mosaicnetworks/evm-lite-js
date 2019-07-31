import Keystore from './Keystore';

const keystore = new Keystore('/Users/danu/Library/EVMLC/keystore');

keystore
	.list()
	.then(mk => console.log(mk))
	.catch(console.log);
