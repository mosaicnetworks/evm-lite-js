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
		const res = await this.get(`/block/${index}`);

		try {
			return Promise.resolve(JSON.parse(res));
		} catch (e) {
			return Promise.reject(res);
		}
	}

	public async getBlocks(
		startIndex: number,
		count?: number
	): Promise<IBabbleBlock[]> {
		let path = `/blocks/${startIndex}`;

		if (count) {
			path += `?count=${count}`;
		}

		const res: string = await this.get(path);

		try {
			return Promise.resolve(JSON.parse(res));
		} catch (e) {
			return Promise.reject(res);
		}
	}

	public async getPeers(): Promise<IBabblePeer[]> {
		const res = await this.get(`/peers`);

		try {
			return Promise.resolve(JSON.parse(res));
		} catch (e) {
			return Promise.reject(res);
		}
	}

	public async getGenesisPeers(): Promise<IBabblePeer[]> {
		const res = await this.get(`/genesispeers`);

		try {
			return Promise.resolve(JSON.parse(res));
		} catch (e) {
			return Promise.reject(res);
		}
	}
}

export default Babble;
