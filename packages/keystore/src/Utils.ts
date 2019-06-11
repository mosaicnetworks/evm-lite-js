import * as fs from 'fs';
// @ts-ignore
import * as mkdir from 'mkdirp';

export default class Utils {
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
}
