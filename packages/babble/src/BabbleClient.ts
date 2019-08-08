import { AbstractClient } from 'evm-lite-core';

// Babble block interface
export interface BabbleBlock {
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

class BabbleClient extends AbstractClient {
	constructor(host: string, port: number) {
		super(host, port);
	}

	// methods here
	public getBlock(index: number): Promise<BabbleBlock> {
		return this.get(`/block/${index}`).then(
			(response: string) => JSON.parse(response) as BabbleBlock
		);
	}
}

export default BabbleClient;
