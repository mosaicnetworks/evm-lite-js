import * as JSONBig from 'json-bigint';

import AbstractClient from './AbstractClient';

import AccountClient from './AccountClient';

export default abstract class DefaultClient extends AbstractClient {
	protected constructor(host: string, port: number) {
		super(host, port);
	}

	public async testConnection(): Promise<boolean> {
		return this.get('/info').then(() => true);
	}

	public getInfo(): Promise<Readonly<object>> {
		return this.get('/info').then((response: string) =>
			JSONBig.parse(response)
		);
	}
}
