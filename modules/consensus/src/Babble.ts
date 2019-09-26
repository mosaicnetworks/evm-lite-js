import { IAbstractConsensus } from './Solo';

import { AbstractClient } from 'evm-lite-client';

export type BabbleBlock = {
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
};

export type BabblePeer = {
	NetAddr: string;
	PubKeyHex: string;
	Moniker: string;
};

export type ValidatorHistory = {
	[key: string]: BabblePeer[];
};

class Babble extends AbstractClient implements IAbstractConsensus {
	constructor(host: string, port: number) {
		super(host, port);
	}

	/** deprecated */
	public async getBlock(index: number): Promise<BabbleBlock> {
		const res = await this.get(`/block/${index}`);

		return this.response(res);
	}

	public async getBlocks(
		startIndex: number,
		count?: number
	): Promise<BabbleBlock[]> {
		let path = `/blocks/${startIndex}`;

		if (count) {
			path += `?count=${count}`;
		}

		const res: string = await this.get(path);

		return this.response(res);
	}

	public async getPeers(): Promise<BabblePeer[]> {
		const res = await this.get(`/peers`);

		return this.response(res);
	}

	public async getGenesisPeers(): Promise<BabblePeer[]> {
		const res = await this.get(`/genesispeers`);

		return this.response(res);
	}

	// validator endpoints
	public async getValidators(round: number): Promise<BabblePeer[]> {
		const res = await this.get(`/validators/${round}`);

		return this.response(res);
	}

	public async getValidatorHistory(): Promise<ValidatorHistory> {
		const res = await this.get(`/history`);

		return this.response(res);
	}
}

export default Babble;
