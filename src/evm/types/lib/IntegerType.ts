import EVMType from './EVMType';


export class IntegerType extends EVMType {

	constructor(public readonly bits: number) {
		super();
	}

}
