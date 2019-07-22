import * as path from 'path';

export { default as DataDirectory } from './DataDirectory';
export { ConfigurationSchema } from './Configuration';

export function osDataDir(dir: string): string {
	const os = require('os')
		.type()
		.toLowerCase();

	switch (os) {
		case 'windows_nt':
			return path.join(
				require('os').homedir(),
				'AppData',
				'Roaming',
				dir
			);
		case 'darwin':
			return path.join(require('os').homedir(), 'Library', dir);

		default:
			return path.join(require('os').homedir(), `.${dir.toLowerCase()}`);
	}
}
