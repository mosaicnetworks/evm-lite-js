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

export default abstract class AbstractClient {
	protected constructor(
		public readonly host: string,
		public readonly port: number = 8080
	) {}

	protected async get(path: string) {
		return await this.request(this.options('GET', path));
	}

	protected async post(path: string, data: string) {
		return await this.request(this.options('POST', path), data);
	}

	protected options(method: string, path: string): RequestOptions {
		return {
			host: this.host,
			port: this.port,
			method,
			path
		};
	}

	private request(options: RequestOptions, data?: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const req = http.request(options, response => {
				let data = '';

				response.on('data', chunk => (data += chunk));
				response.on('end', () => resolve(data));
				response.on('error', err => reject(err));
			});

			req.on('error', err => reject(err));

			if (data) {
				req.write(data);
			}

			req.end();
		});
	}
}
