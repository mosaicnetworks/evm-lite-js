import * as path from 'path';

import DataDirectory from './DataDirectory';

export { Config } from './Configuration';

// https://github.com/mosaicnetworks/monetd/issues/11
/**
 * Get OS specific data directory paths
 *
 * @param dir - The data directory name
 */
export function osdatadir(dir: string): string {
	const homedir = require('os').homedir();
	const os = require('os')
		.type()
		.toLowerCase();

	switch (os) {
		case 'windows_nt':
			// ~/AppData/Roaming/DIR
			return path.join(homedir, 'AppData', 'Roaming', dir.toUpperCase());
		case 'darwin':
			// ~/Library/DIR
			return path.join(homedir, 'Library', dir.toUpperCase());
		default:
			// ~/.dir
			return path.join(homedir, `.${dir.toLowerCase()}`);
	}
}

export default DataDirectory;
