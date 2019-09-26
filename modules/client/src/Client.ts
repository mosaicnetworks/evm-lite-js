import * as JSONBig from 'json-bigint';

import BN from 'bignumber.js';

import AbstractClient from './AbstractClient';

export type BaseAccount = {
	readonly address: string;
	readonly nonce: number;
	readonly balance: BN;
	readonly bytecode: string;
};

export type Log = {
	readonly topics: string[];
	readonly address: string;
	readonly data: string;
	readonly blockNumber: string;
	readonly transactionHash: string;
	readonly transactionIndex: string;
	readonly blockHash: string;
	readonly logIndex: string;
	readonly removed: boolean;
	readonly event?: string;
	readonly args: any;
};

export type TxReceipt = {
	readonly root: string;
	readonly transactionHash: string;
	readonly from: string;
	readonly to?: string;
	readonly gasUsed: number;
	readonly cumulativeGasUsed: number;
	readonly contractAddress: string;
	readonly logs: Log[];
	readonly logsBloom: string;
	readonly status: number;
};

export type SendTxResponse = {
	readonly txHash: string;
};

export type Input = {
	readonly name: string;
	readonly type: string;
};

export type ABI = {
	readonly constant?: any;
	readonly inputs: Input[];
	readonly name: string;
	readonly outputs?: any[];
	readonly payable: any;
	readonly stateMutability: any;
	readonly type: any;
};

export type ContractABI = ABI[];

type CallTxResponse = {
	data: string;
};

export type POAContract = {
	readonly address: string;
	readonly abi: ContractABI;
};

export type BaseInfo = {
	type: string;
	tx_index: string;
};

class BaseEVMLC extends AbstractClient {
	constructor(host: string, port: number = 8080) {
		super(host, port);
	}

	public async getPOAContract(): Promise<POAContract> {
		const res = await this.get(`/poa`);

		return this.responseBig(res);
	}

	public async getReceipt(txHash: string): Promise<TxReceipt> {
		const res = await this.get(`/tx/${txHash}`);

		return this.responseBig(res);
	}

	public async getAccount(
		address: string,
		fromPool?: boolean
	): Promise<BaseAccount> {
		let path = `/account/${address}`;

		if (fromPool !== undefined) {
			path += `?frompool=${fromPool ? 'true' : 'false'}`;
		}

		const response = await this.get(path);
		const account = JSONBig.parse(response) as BaseAccount;

		return account;
	}

	public async getInfo<T extends BaseInfo>(): Promise<T> {
		const res = await this.get('/info');

		return this.responseBig(res);
	}

	// call tx
	public async callTx(tx: string): Promise<CallTxResponse> {
		const res = await this.post('/call', tx);

		return this.responseBig(res);
	}

	// send tx
	public async sendTx(signedTx: string): Promise<TxReceipt> {
		const res = await this.post('/rawtx', signedTx);

		return this.responseBig(res);
	}
}

export default BaseEVMLC;
