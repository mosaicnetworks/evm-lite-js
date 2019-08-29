import * as path from 'path';

import { exec as cexec } from 'child_process';
import { readdirSync } from 'fs';
import { promisify } from 'util';

const exec = promisify(cexec);

const isMarkdown = (source: string) => source.slice(-2) === 'md';

const getMarkdown = (source: string) =>
	readdirSync(source)
		.map(name => path.join(source, name))
		.filter(isMarkdown);

const paths = getMarkdown(path.resolve(__dirname));
(async () => {
	for (const p of paths) {
		const l = p.split('/');
		const f = l.pop();
		const n = f.substr(0, f.length - 3);

		l.push(n);

		const m = l.join('/');

		const o = await exec(
			`pandoc --from=markdown --to=rst --output=${m}.rst ${m}.md`
		);

		console.log(o.stderr || o.stdout);
	}
})();
