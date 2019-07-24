import * as http from 'http';
import * as JSONBig from 'json-bigint';

import { ContractABI } from '../Contract';

import BN from 'bn.js';

interface RequestOptions {
	host: string;
	port: number;
	method: string;
	path: string;
}

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

type Contracts = {
	contracts: { address: string; abi: string }[];
};

export default abstract class AbstractClient {
	protected constructor(
		public readonly host: string,
		public readonly port: number
	) {}

	public async getEstimateGas(tx: string): Promise<{ limit: number }> {
		return JSONBig.parse(await this.post('/estimateGas', tx));
	}

	public async getPOAContract(): Promise<POAContract> {
		return this.get(`/poa`).then(
			(response: string) => JSONBig.parse(response) as POAContract
		);
	}

	public async getContract(): Promise<Contracts> {
		return this.get(`/contract`).then(
			(response: string) => JSONBig.parse(response) as Contracts
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

	protected async callTX(tx: string): Promise<CallTransactionResponse> {
		return JSONBig.parse(await this.post('/call', tx));
	}

	protected async sendTX(tx: string): Promise<TransactionResponse> {
		return await this.post('/send', tx).then(response =>
			JSON.parse(response)
		);
	}

	protected async sendRaw(tx: string): Promise<TransactionResponse> {
		return this.post('/rawtx', tx).then(
			response => JSONBig.parse(response) as TransactionResponse
		);
	}

	private async get(path: string) {
		return await this.request(this.options('GET', path));
	}

	private async post(path: string, tx: string) {
		return await this.request(this.options('POST', path), tx);
	}

	private options(method: string, path: string): RequestOptions {
		return {
			host: this.host,
			port: this.port,
			method,
			path
		};
	}

	private request(options: RequestOptions, tx?: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const req = http.request(options, response => {
				let data = '';

				response.on('data', chunk => (data += chunk));
				response.on('end', () => resolve(data));
				response.on('error', err => reject(err));
			});

			req.on('error', err => reject(err));

			if (tx) {
				req.write(tx);
			}

			req.end();
		});
	}
}
