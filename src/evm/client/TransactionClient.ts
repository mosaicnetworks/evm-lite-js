import * as JSONBig from 'json-bigint';

import BaseClient, { request } from './BaseClient';

export interface TXReceipt {
	root: string;
	transactionHash: string;
	from: string;
	to?: string;
	gasUsed: number;
	cumulativeGasUsed: number;
	contractAddress: string;
	logs: [];
	logsBloom: string;
	status: number;
}

export interface RawTXSubmitResponse {
	txHash: string;
}

export interface SendTXResponse {
	txHash: string;
}

export default class TransactionClient extends BaseClient {
	constructor(host: string, port: number) {
		super(host, port);
	}

	protected callTX(tx: string): Promise<Readonly<string>> {
		return request(this.options('POST', '/call'), tx);
	}

	protected sendTX(tx: string): Promise<Readonly<SendTXResponse>> {
		return request(this.options('POST', '/tx'), tx).then(response =>
			JSON.parse(response)
		);
	}

	protected sendRaw(tx: string): Promise<Readonly<RawTXSubmitResponse>> {
		return request(this.options('POST', '/rawtx'), tx).then(response =>
			JSONBig.parse<RawTXSubmitResponse>(response)
		);
	}

	protected getReceipt(txHash: string): Promise<Readonly<TXReceipt>> {
		return request(this.options('GET', `/tx/${txHash}`)).then(
			(response: string) => JSONBig.parse<TXReceipt>(response)
		);
	}
}
