import EVMType from './EVMType';

export default class ArrayType<T extends EVMType> extends EVMType {
	constructor(public readonly item: T, public readonly size?: number) {
		super();
	}
}
