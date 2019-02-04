import * as fs from 'fs';
import * as path from 'path';
import * as solc from 'solc';

import evmlc, { assert } from '../setup';

import { BaseContractSchema, Transaction } from '../../src';

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

describe('SolidityContract.ts', () => {
	it('should create a new contract object with defaults', async () => {
		const contract = await evmlc.loadContract<CrowdFundingSchema>(
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
		assert.equal(
			Object.keys(contract.methods).length === 0,
			true,
			'there should be no methods added'
		);
	});

	it('should create contract with functions when address set', async () => {
		const contract = await evmlc.loadContract<CrowdFundingSchema>(
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
		const contract = await evmlc.loadContract<CrowdFundingSchema>(
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

	it('should create a new contract object and deploy it to a node', async () => {
		const account = evmlc.accounts.create();
		const contract = await evmlc.loadContract<CrowdFundingSchema>(
			compiled.abi,
			{
				data: compiled.bytecode
			}
		);

		assert.equal(
			Object.keys(contract.methods).length === 0,
			true,
			'there should be no methods added'
		);

		await contract.deploy(account, []);

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
});
