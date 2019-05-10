import * as JSONBig from 'json-bigint';

import AbstractClient from './AbstractClient';

export interface Log {
	topics: string[];
	address: string;
	data: string;
	blockNumber: string;
	transactionHash: string;
	transactionIndex: string;
	blockHash: string;
	logIndex: string;
	removed: boolean;
	event?: string;
	args: any;
}

export interface TXReceipt {
	root: string;
	transactionHash: string;
	from: string;
	to?: string;
	gasUsed: number;
	cumulativeGasUsed: number;
	contractAddress: string;
	logs: Log[];
	logsBloom: string;
	status: number;
}

export interface RawTXSubmitResponse {
	txHash: string;
}

export interface SendTXResponse {
	txHash: string;
}

export default abstract class TransactionClient extends AbstractClient {
	constructor(host: string, port: number) {
		super(host, port);
	}

	protected async callTX(tx: string): Promise<string> {
		return await this.post('/call', tx);
	}

	protected async sendTX(tx: string): Promise<SendTXResponse> {
		return await this.post('/send', tx).then(response =>
			JSON.parse(response)
		);
	}

	protected async sendRaw(tx: string): Promise<RawTXSubmitResponse> {
		return this.post('/rawtx', tx).then(
			response => JSONBig.parse(response) as RawTXSubmitResponse
		);
	}

	protected async getReceipt(txHash: string): Promise<TXReceipt> {
		return this.get(`/tx/${txHash}`).then(
			(response: string) => JSONBig.parse(response) as TXReceipt
		);
	}
}
