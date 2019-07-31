// @ts-ignore
import randomBytes from 'randombytes';
// @ts-ignore
import uuid from 'uuid';

// @ts-ignore
import { createCipheriv, createDecipheriv } from 'browserify-cipher';

const scryptPackage = require('scrypt');
// const crypto = require('crypto');
// import * as crypto from 'crypto';
// Older version
// let scrypt = require('scryptsy')

let scrypt = function(
	key: string | Buffer,
	salt: any,
	N: number,
	r: number,
	p: number,
	dkLength: number
) {
	// C++ wrapper for scrypt
	return scryptPackage.hashSync(key, { N, r, p }, dkLength, salt);
	// Built in crypto module node.js for >= 10.5.0
	// return crypto.scryptSync(key, salt, dkLength, { N, r, p, maxmem: N });
};
const keccak256 = require('keccak256');

import { Account, BaseAccount } from 'evm-lite-core';

interface KDFParams {
	dklen: number;
	salt: string;
	n: number;
	r: number;
	p: number;
}

export interface V3Keyfile {
	readonly version: number;
	readonly id: string;
	readonly address: string;
	readonly crypto: {
		readonly ciphertext: string;
		readonly cipherparams: { iv: string };
		readonly cipher: string;
		readonly kdf: string;
		readonly kdfparams: KDFParams;
		readonly mac: string;
	};
}

export interface MonikerBaseAccount extends BaseAccount {
	moniker: string;
}

export interface MonikerKeystore {
	[key: string]: V3Keyfile;
}

export default abstract class AbstractKeystore {
	protected constructor() {}

	public abstract create(
		moniker: string,
		password: string,
		overridePath?: string
	): Promise<V3Keyfile>;
	public abstract list(): Promise<MonikerKeystore>;
	public abstract get(moniker: string): Promise<V3Keyfile>;
	public abstract update(
		moniker: string,
		oldPass: string,
		newPass: string
	): Promise<V3Keyfile>;
	public abstract import(keyfile: V3Keyfile): Promise<V3Keyfile>;
	public abstract export(moniker: string): Promise<V3Keyfile>;

	public static encrypt(account: Account, password: string) {
		let derivedKey;

		const salt = randomBytes(32);
		const iv = randomBytes(16);
		const kdf = 'scrypt';
		const kdfparams: any = {
			dklen: 32,
			salt: salt.toString('hex')
		};

		if (kdf === 'scrypt') {
			kdfparams.n = 8192;
			kdfparams.r = 8;
			kdfparams.p = 1;
			derivedKey = scrypt(
				Buffer.from(password),
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

	public static decrypt(json: V3Keyfile, password: string) {
		if (!password) {
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
				Buffer.from(password),
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
}
