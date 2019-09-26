import * as fs from 'fs';

import * as path from 'path';
import Keystore from '../src/Keystore';
import utils from 'evm-lite-utils';

const keystore = new Keystore(path.join(__dirname, 'keystore'));
const passphrase = 'supersecurepassword';

// clean keystore before each test
beforeEach(() => {
	const files = fs.readdirSync(keystore.path).filter(file => {
		return !file.startsWith('.');
	});

	files.forEach(file => {
		fs.unlinkSync(path.join(keystore.path, file));
	});
});

// create();
describe('create()', () => {
	test('should error since moniker is not in required format', async () => {
		expect.assertions(1);

		// invalid moniker
		const moniker = 'danu-123';

		try {
			// create keyfile
			await keystore.create(moniker, passphrase);
		} catch (e) {
			expect(e instanceof Error).toBe(true);
		}
	});

	test('should create a keyfile with the moniker as filename', async () => {
		expect.assertions(2);

		// valid moniker
		const moniker = 'danu_123';

		try {
			// create keystore
			const keyfile = await keystore.create(moniker, passphrase);

			expect(keyfile).not.toBe(undefined);
			expect(utils.cleanAddress(keyfile.address).length).toBe(42);
		} catch (e) {
			// pass here as it should not error
		}
	});
});

describe('list()', () => {
	test('should return a dictionary with keys being lowercased', async () => {
		// create a few keyfiles
		await keystore.create('nODe0', passphrase);
		await keystore.create('Node1', passphrase);
		await keystore.create('NODE2', passphrase);

		const mk = await keystore.list();
		const monikers = Object.keys(mk);

		for (const moniker of monikers) {
			expect(moniker).toBe(moniker.toLowerCase());
			expect(mk[moniker]).not.toBe(undefined);
			expect(utils.cleanAddress(mk[moniker].address).length).toBe(42);
		}
	});
});

describe('get()', () => {
	test('should error since moniker is not in required format', async () => {
		expect.assertions(1);

		// invalid moniker
		const moniker = 'danu-123';

		try {
			// get keyfile
			await keystore.get(moniker);
		} catch (e) {
			expect(e instanceof Error).toBe(true);
		}
	});

	test('should error as no keyfile exists for moniker', async () => {
		expect.assertions(1);

		// moniker valid but corresponding no keyfile
		const moniker = 'danu_123';

		try {
			// get keyfile
			await keystore.get(moniker);
		} catch (e) {
			expect(e instanceof Error).toBe(true);
		}
	});

	test('should get keyfile regardless of moniker casing', async () => {
		expect.assertions(1);

		const moniker = 'nODe0';

		// create a few keyfiles
		const created = await keystore.create(moniker, passphrase);

		try {
			const fetched = await keystore.get(moniker.toUpperCase());

			expect(created.address).toBe(fetched.address);
		} catch (e) {
			// pass as it should not error
		}
	});
});

describe('update()', () => {
	test('should update keyfile with a new password', async () => {
		expect.assertions(0);

		const moniker = 'node1';

		await keystore.create(moniker, passphrase);
		await keystore.update(moniker, passphrase, 'newpass');
		// update passphrase back to old to confirm it work
		await keystore.update(moniker, 'newpass', 'passphrase');
	});
});
