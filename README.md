# EVM-Lite Library

[![npm version](https://badge.fury.io/js/evm-lite-lib.svg)](https://badge.fury.io/js/evm-lite-lib)

A javascript library to interact with EVM-Lite.

## Installation

To install `evm-lite-lib` by using `npm`:

```console
npm install evm-lite-lib
```

Note: Type definitions are provided for Typescript users.

## Example

Below is a basic example of how to transfer from a controlled account.

### Transfer
```javascript
const evmlib = require('evm-lite-lib');

// Transaction Addresses
const from = '0x479e8b1b9d8b509755677f6d61d2f7339ba4c0fd';
const to = '0x1dEC6F07B50CFa047873A508a095be2552680874';

// EVMLC object
const evmlc = new evmlib.EVMLC('127.0.0.1', 8080, {
	from,
	gas: 100000,
	gasPrice: 0
});

// Data directory object
const dataDirectory = new evmlib.DataDirectory('[..]/.evmlc');

async function signTransactionLocally() {

	// Get keystore object from the keystore directory
	// For the from address so we can decrypt and sign
	const keystoreFile = await dataDirectory.keystore.get(from);

	// Decrypt the v3JSONKeystore file so expose `sign` function
	const decryptedAccount = evmlib.Account.decrypt(keystoreFile, 'asd');

	// Prepare a transaction with value of 2000
	const transaction = await evmlc.prepareTransfer(to, 2000);

	// Sign transaction and return a new Transaction object
	const signedTransaction = await transaction.sign(decryptedAccount);

	return await signedTransaction.sendRawTX();
}

signTransactionLocally()
	.then((txResponse) => console.log(txResponse))
	.catch((error) => console.log(error));
```

### Contract Abstraction
```javascript
const EVMLC = require('evm-lite-lib').EVMLC;
const DataDirectory = require('evm-lite-lib').DataDirectory;
const Accounts = require('evm-lite-lib').Account;
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
const contractPath = '[..]/CrowdFunding.sol';
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
	const signedTransaction = await deployTransaction.sign(decryptedAccount);

	// Send deployment transaction
	return await signedTransaction.sendRawTX();
}

deploySmartContract()
	.then((txResponse) => console.log(txResponse))
	.catch((error) => console.log(error));
```

