module.exports = {
	testEnvironment: 'node',
	transform: {
		'.(ts)': 'ts-jest'
	},
	testRegex: '(/tests/.*|(\\.|/)(test))\\.ts?$',
	moduleFileExtensions: ['ts', 'js'],
	roots: ['packages/']
};
