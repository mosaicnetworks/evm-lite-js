module.exports = {
	testEnvironment: 'node',
	transform: {
		'.(ts)': 'ts-jest'
	},
	testRegex: '(/tests/.*|(\\.|/)(test))\\.ts?$',
	moduleFileExtensions: ['ts', 'js'],

	// collectCoverage: true,
	// collectCoverageFrom: ['packages/**/*.{ts}', '!**/node_modules/**'],

	roots: ['packages/']
};
