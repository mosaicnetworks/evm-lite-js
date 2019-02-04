import * as http from 'http';

export const request = (options: Options, tx?: string): Promise<string> => {
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
};

export interface Options {
	host: string;
	port: number;
	method: string;
	path: string;
}

export default abstract class BaseClient {
	protected constructor(
		public readonly host: Readonly<string>,
		public readonly port: Readonly<number>
	) {}

	protected options(method: string, path: string): Options {
		return {
			host: this.host,
			port: this.port,
			method,
			path
		};
	}
}
