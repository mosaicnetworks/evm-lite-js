import AbstractClient from './AbstractClient';

abstract class AbstractConsensus extends AbstractClient {
	protected constructor(host: string, port: number) {
		super(host, port);
	}

	public abstract async getBlock(index: number): Promise<any>;

	public abstract async getPeers(): Promise<any[]>;
}

export default AbstractConsensus;
