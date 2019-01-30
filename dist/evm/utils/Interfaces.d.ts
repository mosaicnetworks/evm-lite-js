export interface Input {
	name: string;
	type: string;
	indexed?: boolean;
}
export interface ABI {
	anonymous?: boolean;
	constant?: any;
	inputs: Input[];
	name?: any;
	outputs?: any[];
	payable?: any;
	stateMutability?: any;
	type?: any;
}
