const EVMLC = require('evm-lite-lib').EVMLC;
const DataDirectory = require('evm-lite-lib').DataDirectory;

const solc = require('solc');
const fs = require('fs');

// Default from address
const from = '0x1a5c6b111e883d920fd24fee0bafae838958fa05';

// EVMLC object
const evmlc = new EVMLC('127.0.0.1', 8080, {
	from,
	gas: 1000000,
	gasPrice: 0
});

// Keystore object
const dataDirectory = new DataDirectory('[..]/.evmlc');

// Contract Object
const contractPath = './assets/CrowdFunding.sol';
const contractFile = fs.readFileSync(contractPath, 'utf8');
const contractName = ':' + 'CrowdFunding';

const output = solc.compile(contractFile, 1);
const ABI = JSON.parse(output.contracts[contractName].interface);
const data = output.contracts[contractName].bytecode;

const generateContract = async () => {
	// Get keystore and decrypt
	const account = await dataDirectory.keystore.decrypt(from, 'password');

	// Generate contract object with ABI and data
	const contract = await evmlc.generateContractFromABI(ABI, data);

	// Deploy and return contract with functions populated
	return await contract.deploy(account, {
		parameters: [100000]
	});
};

generateContract()
	.then((contract) => console.log(contract.methods))
	.catch((error) => console.log(error));
