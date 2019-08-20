import { AbstractClient } from 'evm-lite-client';

abstract class AbstractConsensus extends AbstractClient {
	protected constructor(host: string, port: number) {
		super(host, port);
	}

	// insane generic consensus that extends client
}

export default AbstractConsensus;
