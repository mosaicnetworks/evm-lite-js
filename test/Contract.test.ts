import * as fs from 'fs';
import * as solc from 'solc';

import { BaseContractSchema, DataDirectory, EVMLC, Transaction } from '../src';

// Contract function schema
interface CrowdFundingSchema extends BaseContractSchema {
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
const from = '0X5E54B1907162D64F9C4C7A46E3547084023DA2A0'.toLowerCase();
const defaultOptions = {
	from,
	gas: 1000000,
	gasPrice: 0
};

// EVMLC controller object
const evmlc = new EVMLC('127.0.0.1', 8080, defaultOptions);
const directory = new DataDirectory('/Users/danu/.evmlc');

// Return generated object
const generateContract = async () => {
	const account = await directory.keystore.decrypt(from, 'asd');
	const contract = await evmlc.generateContractFromABI<CrowdFundingSchema>(ABI, data);

	return contract.deploy(account, [1000]);
};

generateContract()
	.then((contract) => console.log(contract.options))
	.catch((error) => console.log(error));
