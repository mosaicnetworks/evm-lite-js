import * as fs from 'fs';
import * as solc from 'solc';

import {
	BaseContractSchema,
	DataDirectory,
	EVMLC,
	Transaction
} from 'evm-lite-lib';

interface CrowdFundingSchema extends BaseContractSchema {
	contribute: () => Promise<Transaction>;
	checkGoalReached: () => Promise<Transaction>;
	settle: () => Promise<Transaction>;
}

const contractFile = fs.readFileSync('../assets/CrowdFunding.sol', 'utf8');
const contractName = ':' + 'CrowdFunding';
const output = solc.compile(contractFile, 1);
const compiled = {
	bytecode: output.contracts[contractName].bytecode,
	abi: JSON.parse(output.contracts[contractName].interface)
};

const from = '0X5E54B1907162D64F9C4C7A46E3547084023DA2A0'.toLowerCase();
const directory = new DataDirectory('/Users/danu/.evmlc');
const account = directory.keystore.decrypt(from, 'asd');
const contractAddress = '0x38CB86c8123e68164390259D022b5D2afffCB273';

const evmlc = new EVMLC('127.0.0.1', 8080, {
	from,
	gas: 1000000,
	gasPrice: 0
});

const loadContract = async () => {
	return await evmlc.contracts.load<CrowdFundingSchema>(compiled.abi, {
		data: compiled.bytecode,
		contractAddress
	});
};

loadContract()
	.then(async contract => {
		const transaction = await contract.methods.contribute();

		transaction.value(10);

		await transaction.submit(await account, { timeout: 2 });

		console.log(transaction.receipt);

		return contract;
	})
	.then(async contract => {
		const account = await evmlc.accounts.getAccount(
			contract.options.address!.value
		);

		console.log(account);

		return contract;
	})
	.then(async contract => {
		const transaction = await contract.methods.checkGoalReached();
		const response = await transaction.submit(await account, {
			timeout: 2
		});

		console.log(response);

		return contract;
	})
	.catch(error => console.log(error));

export default loadContract;
