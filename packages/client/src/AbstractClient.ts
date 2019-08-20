import * as http from 'http';

interface IOptions {
	host: string;
	port: number;
	method: string;
	path: string;
}

export default abstract class AbstractClient {
	protected constructor(
		public readonly host: string,
		public readonly port: number
	) {}

	protected async get(path: string) {
		return await this.request(this.options('GET', path));
	}

	protected async post(path: string, data: string) {
		return await this.request(this.options('POST', path), data);
	}

	protected options(method: string, path: string): IOptions {
		return {
			host: this.host,
			port: this.port,
			method,
			path
		};
	}

	private request(options: IOptions, data?: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const req = http.request(options, response => {
				let res = '';

				response.on('data', chunk => (res += chunk));
				response.on('end', () => resolve(res));
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
