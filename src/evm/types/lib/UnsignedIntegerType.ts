import EVMType from './EVMType';

export class UnsignedIntegerType extends EVMType {
	constructor(public readonly bits: number) {
		super();
	}
}
