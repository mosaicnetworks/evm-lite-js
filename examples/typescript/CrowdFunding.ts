import * as fs from 'fs';
import * as solc from 'solc';

import {
	BaseContractSchema,
	DataDirectory,
	EVMLC,
	Transaction
} from '../../src';

interface CrowdFundingSchema extends BaseContractSchema {
	contribute: () => Promise<Transaction>;
	checkGoalReached: () => Promise<Transaction>;
	settle: () => Promise<Transaction>;
}

const compile = solc.compile('../assets/CrowdFunding.sol', 1);
const compiled = {
	abi: JSON.parse(compile.contracts[`:CrowdFunding`].interface),
	bytecode: JSON.parse(compile.contracts[`:CrowdFunding`].bytecode)
};

const from = '0X5E54B1907162D64F9C4C7A46E3547084023DA2A0'.toLowerCase();
const defaultOptions = {
	from,
	gas: 1000000,
	gasPrice: 0
};

const evmlc = new EVMLC('127.0.0.1', 8080, defaultOptions);
const directory = new DataDirectory('/Users/danu/.evmlc');
const account = directory.keystore.decrypt(from, 'asd');
const contractAddress = '0x38CB86c8123e68164390259D022b5D2afffCB273';

const loadContract = async () => {
	return await evmlc.loadContract<CrowdFundingSchema>(compiled.abi, {
		data: compiled.bytecode,
		contractAddress
	});
};

loadContract()
	.then(async contract => {
		const transaction = await contract.methods.contribute();

		transaction.value(1100);

		await transaction.submit({}, await account);

		return contract;
	})
	.then(async contract => {
		const account = await evmlc.getAccount(contract.options.address!.value);
		console.log(account);

		return contract;
	})
	.then(async contract => {
		const transaction = await contract.methods.checkGoalReached();
		const response = await transaction.submit({}, await account);

		transaction.value(0);
		console.log(transaction.toJSON());
		console.log(response);

		return contract;
	})
	.catch(error => console.log(error));

export default loadContract;
