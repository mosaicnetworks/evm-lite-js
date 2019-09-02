import { IAbstractConsensus } from './Solo';

import { AbstractClient } from 'evm-lite-client';

export interface IBabbleBlock {
	[key: string]: any;
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

class Babble extends AbstractClient implements IAbstractConsensus {
	constructor(host: string, port: number) {
		super(host, port);
	}

	/** deprecated */
	public async getBlock(index: number): Promise<IBabbleBlock> {
		return JSON.parse(await this.get(`/block/${index}`));
	}

	public async getBlocks(
		startIndex: number,
		limit?: number
	): Promise<IBabbleBlock[] | IBabbleBlock> {
		let path = `/blocks/${startIndex}`;

		if (limit) {
			path += `?limit=${limit}`;
		}

		const res: string = await this.get(path);

		try {
			return JSON.parse(res);
		} catch (e) {
			return Promise.reject(res);
		}
	}

	public async getPeers(): Promise<IBabblePeer[]> {
		return JSON.parse(await this.get(`/peers`));
	}

	public async getGenesisPeers(): Promise<IBabblePeer[]> {
		return JSON.parse(await this.get(`/genesispeers`));
	}
}

export default Babble;
