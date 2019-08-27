import { AbstractClient } from 'evm-lite-client';

// need to strict definition of this consensus interface
export interface IAbstractConsensus extends AbstractClient {
	[key: string]: any;
}

class Solo extends AbstractClient implements IAbstractConsensus {
	constructor(host: string, port: number) {
		super(host, port);
	}

	// tbc
}

export default Solo;
