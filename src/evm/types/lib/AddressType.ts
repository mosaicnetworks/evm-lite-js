import EVMType from './EVMType';


export default class AddressType extends EVMType {
	constructor(public readonly value: string) {
		super();
	}
}
