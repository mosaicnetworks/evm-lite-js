import EVMType from './EVMType';

export default class ByteType extends EVMType {
	public readonly size: number;

	constructor() {
		super();
		this.size = 1;
	}
}
