import * as http from 'http';

export interface HTTPOptions {
	host: string;
	port: number;
	method: string;
	path: string;
}

export default abstract class AbstractClient {
	protected constructor(
		public readonly host: Readonly<string>,
		public readonly port: Readonly<number>
	) {}

	protected async get(path: string) {
		return await this.request(this.options('GET', path));
	}

	protected async post(path: string, tx: string) {
		return await this.request(this.options('GET', path), tx);
	}

	private options(method: string, path: string): HTTPOptions {
		return {
			host: this.host,
			port: this.port,
			method,
			path
		};
	}

	private request(options: HTTPOptions, tx?: string): Promise<string> {
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
