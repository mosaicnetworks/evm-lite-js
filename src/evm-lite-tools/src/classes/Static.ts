import * as fs from 'fs';
import * as mkdir from 'mkdirp';

export default class Static {
	public static exists(path: string): boolean {
		return fs.existsSync(path);
	}

	public static isDirectory(path: string): boolean {
		return fs.lstatSync(path).isDirectory();
	}

	public static createDirectoryIfNotExists(path: string): void {
		if (!Static.exists(path)) {
			mkdir.sync(path);
		}
	}

	public static cleanAddress(address: string) {
		address = address.toLocaleLowerCase();

		if (!address.startsWith('0x')) {
			return '0x' + address;
		}

		return address;
	}

	public static createOrReadFile(path: string, data: string): string {
		if (!Static.exists(path)) {
			fs.writeFileSync(path, data);

			return data;
		}

		return fs.readFileSync(path, 'utf8');
	}

	public static getParentAndName(path: string) {
		const list = path.split('/');
		const name = list.pop() || 'keystore';
		const parent = list.join('/');

		return {
			parent,
			name
		};
	}

	public static isEquivalentObjects(objectA: any, objectB: any) {
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
				if (
					!Static.isEquivalentObjects(
						objectA[propName],
						objectB[propName]
					)
				) {
					return false;
				}
			} else if (objectA[propName] !== objectB[propName]) {
				return false;
			}
		}

		return true;
	}
}
