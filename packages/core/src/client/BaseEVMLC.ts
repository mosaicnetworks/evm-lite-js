import * as JSONBig from 'json-bigint';

import BN from 'bn.js';

import { ContractABI } from '../Contract';

import AbstractClient from './AbstractClient';

export interface BaseAccount {
	readonly address: string;
	readonly nonce: number;
	readonly balance: BN | number;
	readonly bytecode: string;
}

export interface Log {
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
}

export interface TransactionReceipt {
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
}

export interface TransactionResponse {
	readonly txHash: string;
}

interface CallTransactionResponse {
	data: string;
}

interface POAContract {
	readonly address: string;
	readonly abi: ContractABI;
}

class BaseEVMLC extends AbstractClient {
	protected constructor(host: string, port: number) {
		super(host, port);
	}

	protected async callTX(tx: string): Promise<CallTransactionResponse> {
		return JSONBig.parse(await this.post('/call', tx));
	}

	protected async sendRaw(tx: string): Promise<TransactionResponse> {
		return this.post('/rawtx', tx).then(response => {
			return JSONBig.parse(response) as TransactionResponse;
		});
	}

	public async getPOAContract(): Promise<POAContract> {
		return this.get(`/poa`).then(
			(response: string) => JSONBig.parse(response) as POAContract
		);
	}

	public async getReceipt(txHash: string): Promise<TransactionReceipt> {
		return this.get(`/tx/${txHash}`).then(
			(response: string) => JSONBig.parse(response) as TransactionReceipt
		);
	}

	public async getAccount(address: string): Promise<BaseAccount> {
		const response = await this.get(`/account/${address}`);
		const account = JSONBig.parse(response) as BaseAccount;

		return account;
	}

	public getInfo(): Promise<Readonly<object>> {
		return this.get('/info').then((response: string) =>
			JSONBig.parse(response)
		);
	}
}

export default BaseEVMLC;
