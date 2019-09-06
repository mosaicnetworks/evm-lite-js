// @ts-ignore
import randomBytes from 'randombytes';
// @ts-ignore
import uuid from 'uuid';

// @ts-ignore
import { createCipheriv, createDecipheriv } from 'browserify-cipher';

// Built in crypto module node.js for >= 10.5.0
import crypto from 'crypto';


const scrypt = (
	key: string | Buffer,
	salt: any,
	N: number,
	r: number,
	p: number,
	dkLength: number
) => {
	// Monetd uses N = 2^18 = 262144 with Scrypt. This is inherited from 
	// go-ethereum, according to which it requires 256MB of memory and 
	// approximately 1s CPU time on a modern processor. So we set maxmem to 
	// 300MB because the default (32 *1024 *1024 ~= 33MB)is not enough. 
	return crypto.scryptSync(key, salt, dkLength, { N:N, r:r, p:p, maxmem:300000000 });
};
const keccak256 = require('keccak256');

import { IBaseAccount } from 'evm-lite-client';
import { Account } from 'evm-lite-core';

interface IKDFParams {
	dklen: number;
	salt: string;
	n: number;
	r: number;
	p: number;
}

export interface IV3Keyfile {
	readonly version: number;
	readonly id: string;
	readonly address: string;
	readonly crypto: {
		readonly ciphertext: string;
		readonly cipherparams: { iv: string };
		readonly cipher: string;
		readonly kdf: string;
		readonly kdfparams: IKDFParams;
		readonly mac: string;
	};
}

export interface IMonikerBaseAccount extends IBaseAccount {
	moniker: string;
}

export interface IMonikerKeystore {
	[key: string]: IV3Keyfile;
}

/**
 * An abstract class representation of our `moniker` base keystore. All keyfiles
 * are referenced by `moniker` as the unique identifier instead of the address.
 */
export default abstract class AbstractKeystore {
	// The encrypt and decrypt functions for our keystore
	public static encrypt(account: Account, passphrase: string) {
		let derivedKey;

		const salt = randomBytes(32);
		const iv = randomBytes(16);
		const kdf = 'scrypt';
		const kdfparams: any = {
			dklen: 32,
			salt: salt.toString('hex'),
		};

		if (kdf === 'scrypt') {
			kdfparams.n = 262144;
			kdfparams.r = 8;
			kdfparams.p = 1;
			derivedKey = scrypt(
				Buffer.from(passphrase),
				salt,
				kdfparams.n,
				kdfparams.r,
				kdfparams.p,
				kdfparams.dklen
			);
		} else {
			throw new Error('Unsupported kdf');
		}

		const cipher = createCipheriv(
			'aes-128-ctr',
			derivedKey.slice(0, 16),
			iv
		);

		if (!cipher) {
			throw new Error('Unsupported cipher');
		}

		const ciphertext = Buffer.concat([
			cipher.update(
				Buffer.from(account.privateKey.replace('0x', ''), 'hex')
			),
			cipher.final()
		]);

		const mac = keccak256(
			Buffer.concat([
				derivedKey.slice(16, 32),
				// @ts-ignore
				Buffer.from(ciphertext, 'hex')
			])
		);

		return {
			version: 3,
			id: uuid.v4({ random: randomBytes(16) }),
			address: account.address.toLowerCase().replace('0x', ''),
			crypto: {
				ciphertext: ciphertext.toString('hex'),
				cipherparams: {
					iv: iv.toString('hex')
				},
				cipher: 'aes-128-ctr',
				kdf,
				kdfparams,
				mac: mac.toString('hex')
			}
		};
	}

	public static decrypt(json: IV3Keyfile, passphrase: string) {
		if (!passphrase) {
			throw new Error('No password given.');
		}

		if (json.version !== 3) {
			throw new Error('Not a valid V3 wallet');
		}

		let derivedKey;
		let kdfparams;

		if (json.crypto.kdf === 'scrypt') {
			kdfparams = json.crypto.kdfparams;

			derivedKey = scrypt(
				Buffer.from(passphrase),
				Buffer.from(kdfparams.salt, 'hex'),
				kdfparams.n,
				kdfparams.r,
				kdfparams.p,
				kdfparams.dklen
			);
		} else {
			throw new Error('Unsupported key derivation scheme');
		}

		const ciphertext = Buffer.from(json.crypto.ciphertext, 'hex');

		const mac = keccak256(
			Buffer.concat([derivedKey.slice(16, 32), ciphertext])
		).toString('hex');

		if (mac !== json.crypto.mac) {
			throw new Error('Key derivation failed - possibly wrong password');
		}

		const decipher = createDecipheriv(
			json.crypto.cipher,
			derivedKey.slice(0, 16),
			Buffer.from(json.crypto.cipherparams.iv, 'hex')
		);

		const seed = `0x${Buffer.concat([
			decipher.update(ciphertext),
			decipher.final()
		]).toString('hex')}`;

		return Account.fromPrivateKey(seed);
	}

	/**
	 * Abstract class should never be initialised.
	 */
	protected constructor(public readonly path: string) {}

	/**
	 * Create an encrypted V3Keyfile in the keystore.
	 *
	 * @param moniker - The unique human readable identifier for the account
	 * @param passphrase - The passphrase used to encrypt the account
	 * @param overridePath - Override path of the location of the keyfile
	 *
	 * @returns A promise resolving created encrypted keyfile
	 */
	public abstract create(
		moniker: string,
		passphrase: string,
		overridePath?: string
	): Promise<IV3Keyfile>;

	/**
	 * List all keyfiles and return as mapping of moniker to keyfile.
	 *
	 * @returns A promise resolving a mapping of moniker to keyfile
	 */
	public abstract list(): Promise<IMonikerKeystore>;

	/**
	 * Fetch a single keyfile for a specific moniker.
	 *
	 * @param moniker - The moniker of the required keyfile
	 *
	 * @returns A promise resolving the required keyfile
	 */
	public abstract get(moniker: string): Promise<IV3Keyfile>;

	/**
	 * Update the passphrase of a keyfile only if the old passphrase is known.
	 *
	 * @param moniker - The moniker of the keyfile to update passphrase
	 * @param oldPass - Old passphrase of the keyfile
	 * @param newPass - New passphrase to be used to encrypt the keyfile
	 *
	 * @returns A promise resolving the updated keyfile
	 */
	public abstract update(
		moniker: string,
		oldPass: string,
		newPass: string
	): Promise<IV3Keyfile>;

	// import, export functions
	public abstract import(
		moniker: string,
		keyfile: IV3Keyfile
	): Promise<IV3Keyfile>;
	public abstract export(moniker: string): Promise<IV3Keyfile>;
}
