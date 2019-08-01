module.exports = {
	testEnvironment: 'node',
	verbose: true,
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	},
	testMatch: ['<rootDir>/tests/**/*.test.ts'],
	// testRegex: '(/tests/.*|(\\.|/)(test))\\.(tsx?)$',
	moduleFileExtensions: ['ts', 'js', 'node'],
	testPathIgnorePatterns: ['<rootDir>/node_modules']
};
