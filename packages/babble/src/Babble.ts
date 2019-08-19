import AbstractConsensus from 'evm-lite-consensus';

export interface IBabbleBlock {
	Body: {
		Index: number;
		RoundReceived: number;
		StateHash: string;
		FrameHash: string;
		PeersHash: string;
		Transactions: string[];
		InternalTransactions: any[];
		InternalTransactionReceipts: any[];
	};
	Signatures: {
		[key: string]: string;
	};
}

export interface IBabblePeer {
	NetAddr: string;
	PubKeyHex: string;
	Moniker: string;
}

class Babble extends AbstractConsensus {
	constructor(host: string, port: number) {
		super(host, port);
	}

	public async getBlock(index: number): Promise<IBabbleBlock> {
		return JSON.parse(await this.get(`/block/${index}`));
	}

	public async getPeers(): Promise<IBabblePeer[]> {
		return JSON.parse(await this.get(`/peers`));
	}

	public async getGenesisPeers(): Promise<IBabblePeer[]> {
		return JSON.parse(await this.get(`/genesispeers`));
	}
}

export default Babble;
