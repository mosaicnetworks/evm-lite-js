import { AbstractClient } from 'evm-lite-client';

// need to strict definition of this consensus interface
export interface IAbstractConsensus {
	[key: string]: any;
}

class Babble extends AbstractClient implements IAbstractConsensus {
	constructor(host: string, port: number) {
		super(host, port);
	}
}

export default Babble;
