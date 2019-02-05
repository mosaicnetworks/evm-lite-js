import * as fs from 'fs';
import * as path from 'path';
import * as solc from 'solc';

import evmlc, { assert } from '../setup';

import { BaseContractSchema, SolidityContract, Transaction } from '../../src';

interface CrowdFundingSchema extends BaseContractSchema {
	contribute: () => Promise<Transaction>;
	checkGoalReached: () => Promise<Transaction>;
	settle: () => Promise<Transaction>;
}

function compile(contractName: string, fileName: string) {
	const contractPath = path.join(
		path.resolve(__dirname),
		'../assets/' + fileName + '.sol'
	);

	const input = {
		language: 'Solidity',
		sources: {
			Contracts: {
				content: fs.readFileSync(contractPath, 'utf8')
			}
		},
		settings: {
			outputSelection: {
				'*': {
					'*': ['*']
				}
			}
		}
	};

	const output = JSON.parse(solc.compile(JSON.stringify(input)));
	const compiledContract = output.contracts.Contracts[`${contractName}`];

	return {
		bytecode: compiledContract.evm.bytecode.object,
		abi: compiledContract.abi
	};
}

const compiled = compile('CrowdFunding', 'contract');

let contract: SolidityContract<CrowdFundingSchema>;

describe('SolidityContract.ts', () => {
	it('should create a new contract object with defaults', async () => {
		const contract = await evmlc.contracts.load<CrowdFundingSchema>(
			compiled.abi,
			{
				data: compiled.bytecode
			}
		);

		assert.equal(
			contract.options.gas,
			evmlc.defaultGas,
			'default gas should be passed on'
		);
		assert.equal(
			contract.options.gasPrice,
			evmlc.defaultGasPrice,
			'default gas price should be passed on'
		);

		evmlc.defaultGas = 123456789;
		evmlc.defaultGasPrice = 1234;

		const contractTwo = await evmlc.contracts.load<CrowdFundingSchema>(
			compiled.abi,
			{
				data: compiled.bytecode
			}
		);

		assert.equal(
			contractTwo.options.gas,
			evmlc.defaultGas,
			'default gas should be passed on after change'
		);
		assert.equal(
			contractTwo.options.gasPrice,
			evmlc.defaultGasPrice,
			'default gas price should be passed on after change'
		);

		assert.equal(
			Object.keys(contract.methods).length === 0,
			true,
			'there should be no methods added'
		);

		evmlc.defaultGasPrice = 0;
	});

	it('should create contract with functions when address set', async () => {
		const contract = await evmlc.contracts.load<CrowdFundingSchema>(
			compiled.abi,
			{
				data: compiled.bytecode,
				contractAddress: '0x3d9f3699440744ca2dfce1ff40cd21ff4696d908'
			}
		);

		assert.notEqual(
			contract.options.address,
			undefined,
			'deployed contract should have an address set'
		);
		assert.equal(
			Object.keys(contract.methods).length > 0,
			true,
			'there should be methods added'
		);
	});

	it('should create contract with functions when address set after', async () => {
		const contract = await evmlc.contracts.load<CrowdFundingSchema>(
			compiled.abi,
			{
				data: compiled.bytecode
			}
		);

		assert.equal(
			contract.options.address,
			undefined,
			'not deployed contract should not have an address set'
		);
		assert.equal(
			Object.keys(contract.methods).length === 0,
			true,
			'there should be no methods added'
		);

		contract.setAddressAndPopulateFunctions(
			'0x3d9f3699440744ca2dfce1ff40cd21ff4696d908'
		);

		assert.notEqual(
			contract.options.address,
			undefined,
			'deployed contract should have an address set'
		);
		assert.equal(
			Object.keys(contract.methods).length > 0,
			true,
			'there should be methods added'
		);
	});

	it('should create CrowdFunding.sol and deploy it to a node', async () => {
		const account = evmlc.accounts.create();
		evmlc.defaultFrom = account.address;

		const dummyContract = await evmlc.contracts.load<CrowdFundingSchema>(
			compiled.abi,
			{
				data: compiled.bytecode
			}
		);

		assert.equal(
			Object.keys(dummyContract.methods).length === 0,
			true,
			'there should be no methods added'
		);

		await dummyContract.deploy(account, [10]);

		assert.notEqual(
			dummyContract.options.address,
			undefined,
			'deployed contract should have an address set'
		);
		assert.equal(
			Object.keys(dummyContract.methods).length > 0,
			true,
			'there should be methods added'
		);

		contract = dummyContract;
	});

	it('should checkGoalReached() of the dummy contract', async () => {
		const transaction = await contract.methods.checkGoalReached();
		const response: any = await transaction.submit();

		assert.equal(response[0], false, 'funding goal should not be reached');
		assert.equal(
			response[1].toLowerCase(),
			contract.options.from.value.toLowerCase(),
			'contract deployment address should be the beneficiary'
		);
	});
});
