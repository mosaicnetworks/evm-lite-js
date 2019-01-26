import AddressType from './lib/AddressType';
import ArrayType from './lib/ArrayType';
import BooleanType from './lib/BooleanType';
import ByteType from './lib/ByteType';
import EVMType from './lib/EVMType';
import StringType from './lib/StringType';

import { ParsedTX, TX } from '../classes/Transaction';

export { AddressType, ArrayType, BooleanType, ByteType, StringType, EVMType };

export * from './lib/TransactionTypes';

export function parseSolidityTypes(raw: string) {
	switch (raw) {
		case 'bool':
			return new BooleanType();
		case 'address':
			return new AddressType('');
		case 'string':
			return new StringType();
		case 'byte':
			return new ByteType();
		case 'bytes':
			return new ArrayType(new ByteType());
	}
}

export function parseTransaction(tx: TX): ParsedTX {
	return {
		...tx,
		from: tx.from.value,
		to: tx.to && tx.to.value
	};
}
