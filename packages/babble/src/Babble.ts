import AbstractConsensus from 'evm-lite-consensus';

class Babble extends AbstractConsensus {
	constructor(host: string, port: number) {
		super(host, port);
	}

	public getBlock(index: number): Promise<any> {
		throw new Error('Method not implemented.');
	}

	public getPeers(): Promise<any[]> {
		throw new Error('Method not implemented.');
	}
}

export default Babble;
