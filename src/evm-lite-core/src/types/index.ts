import AddressType from './typings/AddressType';
import ArrayType from './typings/ArrayType';
import BooleanType from './typings/BooleanType';
import ByteType from './typings/ByteType';
import EVMType from './typings/EVMType';
import StringType from './typings/StringType';

export { AddressType, ArrayType, BooleanType, ByteType, StringType, EVMType };

export * from './typings/TransactionTypes';

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
