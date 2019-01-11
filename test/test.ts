import * as fs from 'fs';
import * as solc from 'solc';

import { Account as Accounts, DataDirectory, EVMLC } from 'evm-lite-lib';


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

async function deploySmartContract() {

	// Get account from keystore
	const keystoreFile = await dataDirectory.keystore.get(from);

	// Decrypt the account
	const decryptedAccount = Accounts.decrypt(keystoreFile, 'supersecurepassword');

	// Bytecode of compiled account
	const byteCode = output.contracts[contractName].bytecode;

	// Generate contract to deploy later
	const notDeployedContract = (await evmlc.generateContractFromABI(ABI)).data(byteCode);

	// Generate deployment transaction
	const deployTransaction = notDeployedContract.deploy({ parameters: [10000] });

	// Sign transaction with decrypted account
	await deployTransaction.sign(decryptedAccount);

	// Send deployment transaction
	await deployTransaction.submit();

	return deployTransaction
}

deploySmartContract()
	.then((transaction) => console.log(transaction.hash))
	.catch((error) => console.log(error));
