import * as fs from 'fs';
import * as path from 'path';
import * as solc from 'solc';

import evmlc, { assert } from '../../setup';

import { BaseContractSchema, DataDirectory, Transaction } from '../../../src';

interface CrowdFundingSchema extends BaseContractSchema {
	contribute: () => Promise<Transaction>;
	checkGoalReached: () => Promise<Transaction>;
	settle: () => Promise<Transaction>;
}

const contractName: string = ':CrowdFunding';
const output = solc.compile(
	fs.readFileSync('./test/assets/contract.sol', 'utf8'),
	1
);
const ABI: any[] = JSON.parse(output.contracts[contractName].interface);
const data: string = output.contracts[contractName].bytecode;

const directory = new DataDirectory(
	path.join(require('os').homedir(), '.evmlc')
);
const account = directory.keystore.decryptAccount(evmlc.defaultFrom, 'asd');

describe('SolidityContract.ts', () => {
	it('should create a new contract object with defaults', async () => {
		const contract = await evmlc.loadContract<CrowdFundingSchema>(ABI, {
			data
		});

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
		const contract = await evmlc.loadContract<CrowdFundingSchema>(ABI, {
			data,
			contractAddress: '0x3d9f3699440744ca2dfce1ff40cd21ff4696d908'
		});

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
		const contract = await evmlc.loadContract<CrowdFundingSchema>(ABI, {
			data
		});

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
		const contract = await evmlc.loadContract<CrowdFundingSchema>(ABI, {
			data
		});

		assert.equal(
			Object.keys(contract.methods).length === 0,
			true,
			'there should be no methods added'
		);

		await contract.deploy(await account, [10]);

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
