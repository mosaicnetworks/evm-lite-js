import * as path from 'path';

import { exec as cexec } from 'child_process';
import { lstatSync, readdirSync } from 'fs';
import { promisify } from 'util';

const exec = promisify(cexec);

// read all packages
const isDirectory = (source: string) => lstatSync(source).isDirectory();
const getPackages = (source: string) =>
	readdirSync(source)
		.map(name => path.join(source, name))
		.filter(isDirectory);

// symlink all packages with yarn link
const dirs = getPackages(path.resolve(__dirname, '../modules'));

(async () => {
	for (const dir of dirs) {
		const out = await exec(`cd ${dir} && yarn link`);

		console.log(out.stdout || out.stderr);
	}
})();
