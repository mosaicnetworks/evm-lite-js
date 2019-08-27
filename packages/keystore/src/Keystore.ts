import * as fs from 'fs';
import * as p from 'path';

import { promisify } from 'util';

import utils from 'evm-lite-utils';

import { Account } from 'evm-lite-core';

import AbstractKeystore, {
	IMonikerKeystore,
	IV3Keyfile
} from './AbstractKeystore';

// promisify native nodejs file system methods
// to clean up implementing promisified keystore methods
const write = promisify(fs.writeFile);
const read = promisify(fs.readFile);
const readdir = promisify(fs.readdir);

class Keystore extends AbstractKeystore {
	constructor(path: string) {
		super(path);

		utils.createDirectoryIfNotExists(this.path);

		if (!utils.isDirectory(path)) {
			throw Error('Path provided for keystore is not a directory.');
		}
	}

	// to be implemented
	public export(address: string): Promise<IV3Keyfile> {
		throw new Error('Method not implemented.');
	}

	// to be updated to moniker import
	public async import(
		moniker: string,
		keyfile: IV3Keyfile
	): Promise<IV3Keyfile> {
		// lowercase moniker to avoid casing ambiguity
		moniker = moniker.toLowerCase();

		// check moniker matches requirements
		if (!utils.validMoniker(moniker)) {
			return Promise.reject(
				Error(
					'Invalid character(s) in `moniker`. ' +
						'Should only contain letters, numbers and underscores'
				)
			);
		}

		fs.writeFileSync(
			p.join(this.path, `${moniker}.json`),
			JSON.stringify(keyfile)
		);

		return Promise.resolve(keyfile);
	}

	public async create(
		moniker: string,
		passphrase: string,
		overridePath?: string
	): Promise<IV3Keyfile> {
		// needs to create a file with the moniker as the file name
		// file name needs to be only contain letters, numbers and underscore
		// file name also has to be unique in the directory

		// lowercase moniker to avoid casing ambiguity
		moniker = moniker.toLowerCase();

		const account: Account = Account.new();
		const keyfile = Keystore.encrypt(account, passphrase);

		// add `.json` to keep inline with `givery` cli
		const path = p.join(overridePath || this.path, `${moniker}.json`);

		// check moniker matches requirements
		if (!utils.validMoniker(moniker)) {
			return Promise.reject(
				Error(
					'Invalid character(s) in `moniker`. ' +
						'Should only contain letters, numbers and underscores'
				)
			);
		}

		// check if keyfile with moniker already exists
		try {
			// should error as moniker should not exist
			await this.get(moniker);
			return Promise.reject(
				Error(`Moniker already exists in '${this.path}'`)
			);
		} catch (e) {
			// do nothing as moniker is unqiue
		}

		// write keyfile to file
		try {
			await write(path, JSON.stringify(keyfile));
			return Promise.resolve(keyfile);
		} catch (e) {
			return Promise.reject(e);
		}
	}

	public async list(): Promise<IMonikerKeystore> {
		const mk = {} as IMonikerKeystore;

		try {
			const filtered = await this.filtereddir();

			for (const filename of filtered) {
				const [moniker, _] = filename.split('.');
				const keyfile = JSON.parse(
					await read(p.join(this.path, filename), {
						encoding: 'utf8'
					})
				);

				// should not matter to lowercase as moniker is lowercased
				// when created but for sanity, we should leave it in there
				// `giverny` and scripts also generate keyfiles with different
				// casing so will needs to this avoid any incompatability
				mk[moniker.toLowerCase()] = keyfile;
			}

			return Promise.resolve(mk);
		} catch (e) {
			return Promise.reject(e);
		}
	}

	// this function is more time complicated than it should be
	// we should change this so that it reads directly from the keystore
	// as we know the path of the keyfile this.path + moniker.json
	// this will reduce the time complexity but for now this will suffice
	public async get(moniker: string): Promise<IV3Keyfile> {
		try {
			// force to lower case
			moniker = moniker.toLowerCase();

			const mk = await this.list();

			if (!utils.validMoniker(moniker)) {
				return Promise.reject(
					Error('Invalid character(s) in `moniker`')
				);
			}

			const keyfile = mk[moniker];
			if (!keyfile) {
				return Promise.reject(
					new Error('Could not locate keystore for given moniker')
				);
			}

			return Promise.resolve(keyfile);
		} catch (e) {
			return Promise.reject(e);
		}
	}

	public async update(
		moniker: string,
		oldPass: string,
		newPass: string
	): Promise<IV3Keyfile> {
		try {
			// this.get would have validated moniker and checked if exists
			// no need to check here
			const keyfile = await this.get(moniker);
			const account = Keystore.decrypt(keyfile, oldPass);
			const updated = Keystore.encrypt(account, newPass);
			const path = p.join(this.path, `${moniker}.json`);

			await write(path, JSON.stringify(updated));

			return Promise.resolve(updated);
		} catch (e) {
			return Promise.reject(e);
		}
	}

	private async filtereddir(): Promise<string[]> {
		try {
			const dir = await readdir(this.path);
			const filtered = dir
				// filter out any hidden files generated by OS (.DS_Store)
				.filter(f => !f.startsWith('.'))
				// filter only files that match the moniker requirements
				.filter(f => {
					try {
						const [moniker, ext] = f.split('.');
						return utils.validMoniker(moniker) && ext === 'json';
					} catch (e) {
						return false;
					}
				});

			return Promise.resolve(filtered);
		} catch (e) {
			return Promise.reject(e);
		}
	}
}

export default Keystore;
