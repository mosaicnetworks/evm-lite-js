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

export interface IValidatorHistory {
	[key: string]: IBabblePeer[];
}

class Babble extends AbstractClient implements IAbstractConsensus {
	constructor(host: string, port: number) {
		super(host, port);
	}

	/** deprecated */
	public async getBlock(index: number): Promise<IBabbleBlock> {
		const res = await this.get(`/block/${index}`);

		return this.response(res);
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

		return this.response(res);
	}

	public async getPeers(): Promise<IBabblePeer[]> {
		const res = await this.get(`/peers`);

		return this.response(res);
	}

	public async getGenesisPeers(): Promise<IBabblePeer[]> {
		const res = await this.get(`/genesispeers`);

		return this.response(res);
	}

	// validator endpoints
	public async getValidators(round: number) {
		const res = await this.get(`/validators/${round}`);

		return this.response(res);
	}

	public async getValidatorHistory(): Promise<IValidatorHistory> {
		const res = await this.get(`/history`);

		return this.response(res);
	}
}

export default Babble;
