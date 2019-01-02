export function InvalidNumberOfSolidityArgs(expected: number, received: number) {
	return new Error(`Expected ${expected} but got ${received} arguments.`);
}

export function InvalidSolidityType() {
	return new TypeError('Invalid argument type');
}

export function InvalidDataFieldInOptions() {
	return new Error('`data` field must be specified before deploying contract.');
}

export function ContractAddressFieldSetAndDeployed() {
	return new Error('Contract\'s address option is already set. Please reset to undefined to deploy.');
}

