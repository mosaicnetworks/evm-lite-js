const EVMLC = require('evm-lite-lib').EVMLC;
const DataDirectory = require('evm-lite-lib').DataDirectory;
const Web3Utils = require('web3-utils');

const solc = require('solc');
const fs = require('fs');

// Default from address
const from = '0X83B150E3D355B65AA443EBE19327AD368086D649';

// EVMLC object
const evmlc = new EVMLC('127.0.0.1', 8080, {
	from,
	gas: 1000000,
	gasPrice: 0
});

// Keystore object
const dataDirectory = new DataDirectory('/Users/junwei/.evmlc/');
const password = 'password';

// Contract Object
const contractPath = 'solidity/claimhub.sol';
const contractAddress = '0x77f7a0cd3800a581dcdda0d45c23426c4abc91fe';
const contractPath = '../assets/ClaimHub.sol';
const contractFile = fs.readFileSync(contractPath, 'utf8');
const contractName = ':' + 'ClaimHub';
const output = solc.compile(contractFile, 1);
const compiled = {
	bytecode: output.contracts[contractName].bytecode,
	abi: JSON.parse(output.contracts[contractName].interface)
};

const generateContract = async () => {
	// Generate contract object with ABI and data
	return await evmlc.loadContract(compiled.abi, {
		data: compiled.data,
		contractAddress
	});
};

const accountDecrypt = async () => {
	// Get keystore object from the keystore directory
	// For the from address so we can decrypt and sign
	return await dataDirectory.keystore.decrypt(from, password);
};

const setClaim = async (account, cfContract) => {
	const claimOwner = 'Junwei';
	const claimID =
		'SZ9BFDNKYEPJPFNTDZWLMAKNXBCDUFUIXUIKA9GRYPYTTNCNKEWBBVPJXMLD9QPOHRXHMPRKLSBGMIHRL';

	const transaction = await cfContract.methods.setClaim(claimOwner, claimID);

	await transaction.sign(account);
	await transaction.submit();

	return transaction.receipt;
};

const demo = async () => {
	const account = await accountDecrypt();
	const cfContract = await generateContract();
	const response = setClaim(account, cfContract);

	return response;
};

demo()
	.then(res => console.log(res))
	.catch(error => console.log(error));
