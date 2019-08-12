import * as JSONBig from 'json-bigint';

import BN from 'bn.js';

import { ContractABI } from '../Contract';

import AbstractClient from './AbstractClient';

export interface IBaseAccount {
	readonly address: string;
	readonly nonce: number;
	readonly balance: BN | number;
	readonly bytecode: string;
}

export interface ILog {
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

export interface IReceipt {
	readonly root: string;
	readonly transactionHash: string;
	readonly from: string;
	readonly to?: string;
	readonly gasUsed: number;
	readonly cumulativeGasUsed: number;
	readonly contractAddress: string;
	readonly logs: ILog[];
	readonly logsBloom: string;
	readonly status: number;
}

export interface ISendTxResponse {
	readonly txHash: string;
}

interface ICallTxResponse {
	data: string;
}

interface IPOAContract {
	readonly address: string;
	readonly abi: ContractABI;
}

class BaseEVMLC extends AbstractClient {
	protected constructor(host: string, port: number) {
		super(host, port);
	}

	protected async callTx(tx: string): Promise<ICallTxResponse> {
		return JSONBig.parse(await this.post('/call', tx));
	}

	protected async sendTx(signedTx: string): Promise<ISendTxResponse> {
		return JSONBig.parse(await this.post('/rawtx', signedTx));
	}

	public async getPOAContract(): Promise<IPOAContract> {
		return JSONBig.parse(await this.get(`/poa`));
	}

	public async getReceipt(txHash: string): Promise<IReceipt> {
		return JSONBig.parse(await this.get(`/tx/${txHash}`));
	}

	public async getAccount(address: string): Promise<IBaseAccount> {
		const response = await this.get(`/account/${address}`);
		const account = JSONBig.parse(response) as IBaseAccount;

		return account;
	}

	public async getInfo(): Promise<any> {
		return JSONBig.parse(await this.get('/info'));
	}
}

export default BaseEVMLC;
