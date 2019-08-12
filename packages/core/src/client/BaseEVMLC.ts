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

export interface TxReceipt {
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

export interface SendTxResponse {
	readonly txHash: string;
}

interface CallTxResponse {
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

	protected async callTx(tx: string): Promise<CallTxResponse> {
		return JSONBig.parse(await this.post('/call', tx));
	}

	protected async sendTx(signedTx: string): Promise<SendTxResponse> {
		return JSONBig.parse(await this.post('/rawtx', signedTx));
	}

	public async getPOAContract(): Promise<POAContract> {
		return JSONBig.parse(await this.get(`/poa`));
	}

	public async getReceipt(txHash: string): Promise<TxReceipt> {
		return JSONBig.parse(await this.get(`/tx/${txHash}`));
	}

	public async getAccount(address: string): Promise<BaseAccount> {
		const response = await this.get(`/account/${address}`);
		const account = JSONBig.parse(response) as BaseAccount;

		return account;
	}

	public async getInfo(): Promise<any> {
		return JSONBig.parse(await this.get('/info'));
	}
}

export default BaseEVMLC;
