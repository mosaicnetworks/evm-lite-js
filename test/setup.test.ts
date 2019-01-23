import { EVMLC } from '../src';

const evmlc = new EVMLC('127.0.0.1', 8080, {
	from: '0X5E54B1907162D64F9C4C7A46E3547084023DA2A0'.toLowerCase(),
	gas: 100000,
	gasPrice: 0
});

export default evmlc;
