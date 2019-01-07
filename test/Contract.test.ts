import * as fs from 'fs';
import * as solc from 'solc';

import { BaseContractFunctionSchema, EVMLC, Transaction } from '../src';

// Contract function schema
interface CrowdFundingSchema extends BaseContractFunctionSchema {
	contribute: () => Transaction;
	checkGoalReached: () => Transaction;
	settle: () => Transaction;
	otherFunction: (address: string, data: number) => Transaction;
}

// Contract compilation
const contractName: string = ':CrowdFunding';
const output = solc.compile(fs.readFileSync('./test/assets/contract.sol', 'utf8'), 1);
const ABI: any[] = JSON.parse(output.contracts[contractName].interface);
const data: string = output.contracts[contractName].bytecode;

// Default from address
const from = '0x0f22af88f03ab6633ea8d15dbc90721d2c1dc73f';
const defaultOptions = {
	from,
	gas: 1000000,
	gasPrice: 0
};

// EVMLC controller object
const evmlc = new EVMLC('127.0.0.1', 8080, defaultOptions);

// Return generated object
const generateContract = async () => {
	return await evmlc.generateContractFromABI<CrowdFundingSchema>(ABI, data);
};

generateContract()
	.then((contract) => console.log(contract.options));
