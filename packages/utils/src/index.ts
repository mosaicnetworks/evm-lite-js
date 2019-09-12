import * as fs from 'fs';
import * as mkdir from 'mkdirp';

export { default as Currency } from './Currency';
export * from './currency-utils';

class Utils {
	/**
	 * Keystore methods
	 */
	public static validMoniker(moniker: string): boolean {
		return !!moniker.match(/^\w+$/);
	}

	/**
	 * File system methods
	 */
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

	/**
	 * Misc methods
	 */
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

	public static trimLeadingZero = (hex: string) => {
		while (hex.startsWith('0x0')) {
			hex = `0x${hex.slice(3)}`;
		}

		return hex;
	};

	public static makeEven = (hex: string) => {
		if (hex.length % 2 === 1) {
			hex = hex.replace('0x', '0x0');
		}

		return hex;
	};

	// should never be initialized
	private constructor() {}
}

export default Utils;
