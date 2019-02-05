import AddressType from './src/AddressType';
import ArrayType from './src/ArrayType';
import BooleanType from './src/BooleanType';
import ByteType from './src/ByteType';
import EVMType from './src/EVMType';
import StringType from './src/StringType';

export { AddressType, ArrayType, BooleanType, ByteType, StringType, EVMType };

export * from './src/TransactionTypes';

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
