module.exports = {
	testEnvironment: 'node',
	transform: {
		'.(ts)': 'ts-jest'
	},
	testRegex: '(/tests/.*|(\\.|/)(test))\\.ts?$',
	moduleFileExtensions: ['ts', 'js', 'node'],
	roots: ['packages/'],
	transformIgnorePatterns: ['<rootDir>.*(node_modules)(?!.*evm-lite-*.*).*$']
};
