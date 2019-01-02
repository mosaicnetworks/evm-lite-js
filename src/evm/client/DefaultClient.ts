import * as JSONBig from 'json-bigint';

import { request } from './BaseClient';

import AccountClient from './AccountClient';


export default abstract class DefaultClient extends AccountClient {

	protected constructor(host: string, port: number) {
		super(host, port);
	}

	public testConnection(): Promise<boolean> {
		return request(this.options('GET', '/info'))
			.then(() => true);
	}

	public getInfo(): Promise<Readonly<object>> {
		return request(this.options('GET', '/info'))
			.then((response: string) => JSONBig.parse(response));
	}

}
