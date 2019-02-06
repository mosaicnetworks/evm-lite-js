import * as fs from 'fs';
import * as path from 'path';
import * as solc from 'solc';

import {
	BaseContractSchema,
	EVMLC,
	SolidityContract,
	Transaction
} from '../../src';

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
let evmlc: EVMLC;

describe('SolidityContract.ts', () => {
	beforeEach(() => {
		evmlc = new EVMLC('127.0.0.1', 8080, {
			from: '0X5E54B1907162D64F9C4C7A46E3547084023DA2A0',
			gas: 10000000,
			gasPrice: 0
		});
	});

	it('should create a new contract object with defaults', async () => {
		const contract = await evmlc.contracts.load<CrowdFundingSchema>(
			compiled.abi,
			{
				data: compiled.bytecode
			}
		);

		expect(contract.options.gas).toBe(evmlc.defaultGas);
		expect(contract.options.gasPrice).toBe(evmlc.defaultGasPrice);
	});

	it('should create contract with functions when address set', async () => {
		const contract = await evmlc.contracts.load<CrowdFundingSchema>(
			compiled.abi,
			{
				data: compiled.bytecode,
				contractAddress: '0x3d9f3699440744ca2dfce1ff40cd21ff4696d908'
			}
		);

		expect(contract.options.address).not.toBe(undefined);
		expect(Object.keys(contract.methods).length).toBeGreaterThan(0);
	});

	it('should create contract with functions when address set after', async () => {
		const contract = await evmlc.contracts.load<CrowdFundingSchema>(
			compiled.abi,
			{
				data: compiled.bytecode
			}
		);

		expect(contract.options.address).toBe(undefined);
		expect(Object.keys(contract.methods).length).toBe(0);

		contract.setAddressAndPopulateFunctions(
			'0x3d9f3699440744ca2dfce1ff40cd21ff4696d908'
		);

		expect(contract.options.address).not.toBe(undefined);
		expect(Object.keys(contract.methods).length).toBeGreaterThan(0);
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

		expect(Object.keys(dummyContract.methods).length).toBe(0);
		expect(dummyContract.options.from.value).toBe(account.address);

		await dummyContract.deploy(account, [10]);

		expect(dummyContract.options.address).not.toBe(undefined);
		expect(Object.keys(dummyContract.methods).length).toBeGreaterThan(0);

		contract = dummyContract;
	});

	it('should checkGoalReached() of the dummy contract', async () => {
		const transaction = await contract.methods.checkGoalReached();
		const response: any = await transaction.submit();

		expect(response[0]).toBe(false);
		expect(response[1].toLowerCase()).toBe(
			contract.options.from.value.toLowerCase()
		);
	});
});
