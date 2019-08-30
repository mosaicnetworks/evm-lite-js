module.exports = {
	roots: ['<rootDir>/src', '<rootDir>/tests'],
	transform: {
		'^.+\\.ts$': 'ts-jest'
	},
	testRegex: '(/tests/.*.(test|spec)).(jsx?|tsx?)$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	verbose: true
};
