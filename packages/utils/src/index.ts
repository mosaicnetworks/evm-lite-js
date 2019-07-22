import * as fs from 'fs';
import * as mkdir from 'mkdirp';

export default class Utils {
	private constructor() {
		// pass
	}

	public static cleanAddress(address: string) {
		address = Utils.trimHex(address);

		return `0x${address}`;
	}

	public static trimHex(hex: string) {
		hex = hex.toLowerCase();

		while (hex.startsWith('0x')) {
			hex = `${hex.slice(2)}`;
		}

		return hex;
	}

	public static exists(path: string): boolean {
		return fs.existsSync(path);
	}

	public static isDirectory(path: string): boolean {
		return fs.lstatSync(path).isDirectory();
	}

	public static createDirectoryIfNotExists(path: string): void {
		if (!Utils.exists(path)) {
			mkdir.sync(path);
		}
	}

	public static deepEquals(objectA: any, objectB: any) {
		const aProps = Object.getOwnPropertyNames(objectA);
		const bProps = Object.getOwnPropertyNames(objectB);

		if (aProps.length !== bProps.length) {
			return false;
		}

		for (const propName of aProps) {
			if (
				typeof objectA[propName] === 'object' &&
				typeof objectB[propName] === 'object'
			) {
				if (!Utils.deepEquals(objectA[propName], objectB[propName])) {
					return false;
				}
			} else if (objectA[propName] !== objectB[propName]) {
				return false;
			}
		}

		return true;
	}

	public static hexToString(hex: string) {
		let data = '';

		if (!hex) {
			return '';
		}

		for (let i = 0; i < hex.length; i += 2) {
			data += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		}

		return data.trim().replace(/\u0000/g, '');
	}
}
