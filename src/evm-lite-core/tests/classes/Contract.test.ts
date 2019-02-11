// TODO: Change ABI. Current is for the wrong contract.

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

const compiled = {
	bytecode:
		'608060405234801561001057600080fd5b50604051602080610491833981018060' +
		'4052602081101561003057600080fd5b8101908080519060200190929190505050' +
		'6080604051908101604052803373ffffffffffffffffffffffffffffffffffffff' +
		'ff1681526020018281526020016000815260200160008152506000808201518160' +
		'000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02' +
		'1916908373ffffffffffffffffffffffffffffffffffffffff1602179055506020' +
		'820151816001015560408201518160020155606082015181600301559050505061' +
		'039d806100f46000396000f3fe608060405260043610610051576000357c010000' +
		'00000000000000000000000000000000000000000000000000009004806301cb3b' +
		'201461005657806311da60b4146100c6578063d7bb99ba146100dd575b600080fd' +
		'5b34801561006257600080fd5b5061006b6100e7565b6040518085151515158152' +
		'6020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffff' +
		'ffffffffffffffffffffffffffff16815260200183815260200182815260200194' +
		'505050505060405180910390f35b3480156100d257600080fd5b506100db610187' +
		'565b005b6100e5610299565b005b60008060008060006001015460006003015410' +
		'156101425760008060000160009054906101000a900473ffffffffffffffffffff' +
		'ffffffffffffffffffff1660006001015460006003015482925093509350935093' +
		'50610181565b60016000800160009054906101000a900473ffffffffffffffffff' +
		'ffffffffffffffffffffff16600060010154600060030154829250935093509350' +
		'93505b90919293565b60006001015460006003015410151561025a576000806003' +
		'01549050600080600301819055506000800160009054906101000a900473ffffff' +
		'ffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffff' +
		'ffffffffffff166108fc829081150290604051600060405180830381858888f193' +
		'50505050158015610217573d6000803e3d6000fd5b507f09af12d5b97e0b3db4b2' +
		'467182ec45bb12cae9cf8942cf8cf4a34b0fbb2cb3786001604051808215151515' +
		'815260200191505060405180910390a150610297565b7f09af12d5b97e0b3db4b2' +
		'467182ec45bb12cae9cf8942cf8cf4a34b0fbb2cb3786000604051808215151515' +
		'815260200191505060405180910390a15b565b3460006003016000828254019250' +
		'50819055507f567b97209529fbb11a50c435abb5bfdae05a969880bb35a24afc52' +
		'd1f383af806000800160009054906101000a900473ffffffffffffffffffffffff' +
		'ffffffffffffffff163334604051808473ffffffffffffffffffffffffffffffff' +
		'ffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183' +
		'73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffff' +
		'ffffffffffffffffffff1681526020018281526020019350505050604051809103' +
		'90a156fea165627a7a72305820fe262e1a8f143e4f1bc5fecaf3c2e2ce11677985' +
		'06aa4d99f1a3b5137350a51e0029',
	abi: JSON.parse(
		'[{"constant":false,"inputs":[],"name":"getKeys","outputs":[],' +
			'"payable":false,"stateMutability":"nonpayable","type":' +
			'"function"},{"constant":false,"inputs":[{"name":"pubKey"' +
			',"type":"string"},{"name":"rating","type":"uint256"}],"name"' +
			':"addKey","outputs":[],"payable":false,"stateMutability":' +
			'"nonpayable","type":"function"},{"constant":true,"inputs":' +
			'[{"name":"pubKey","type":"string"}],"name":"getKey","outputs"' +
			':[{"name":"key","type":"string"},{"name":"rating","type"' +
			':"uint256"}],"payable":false,"stateMutability":"view","type"' +
			':"function"},{"inputs":[],"payable":false,"stateMutability' +
			'":"nonpayable","type":"constructor"}]'
	)
};

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

		await dummyContract.deploy(account);

		expect(dummyContract.options.address).not.toBe(undefined);
		expect(Object.keys(dummyContract.methods).length).toBeGreaterThan(0);

		contract = dummyContract;
	});

	// it('should checkGoalReached() of the dummy contract', async () => {
	// 	console.log(contract);

	// 	const transaction = await contract.methods.checkGoalReached();
	// 	const response: any = await transaction.submit();

	// 	expect(response[0]).toBe(false);
	// 	expect(response[1].toLowerCase()).toBe(
	// 		contract.options.from.value.toLowerCase()
	// 	);
	// });
});
