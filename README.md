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

Below is a basic example of how to sign locally and submit a transaction to the node.

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
	// Get keystore object from the keystore directory and decrypt
	const account = await dataDirectory.keystore.decrypt(from, 'password');

	// Prepare a transaction with value of 2000
	const transaction = await evmlc.prepareTransfer(to, 2000);

	// Sign transaction and return the same Transaction object
	await transaction.sign(account);

	// Send transaction to node
	await transaction.submit()

	return transaction;
}

signTransactionLocally()
	.then((transaction) => console.log(transaction.hash))
	.catch((error) => console.log(error));
```

### Contract Deployment
```javascript
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
```

### Contract Generation (Typescript)
```typescript
import * as fs from 'fs';
import * as solc from 'solc';

import { Account, BaseContractSchema, DataDirectory, EVMLC, Transaction } from '../src';

// Contract function schema
interface CrowdFundingSchema extends BaseContractSchema {
	contribute: () => Transaction;
	checkGoalReached: () => Transaction;
	settle: () => Transaction;
	otherFunction: (address: string, data: number) => Transaction;
}

// Contract compilation
const contractName: string = ':CrowdFunding';
const output = solc.compile(fs.readFileSync('./test/assets/contract.sol', 'utf8'), 1);
const ABI: any[] = JSON.parse(output.contracts[contractName].interface);
const data: string = output.contracts[contractName].bytecode;

// Default from address
const from = '0X5E54B1907162D64F9C4C7A46E3547084023DA2A0'.toLowerCase();
const defaultOptions = {
	from,
	gas: 1000000,
	gasPrice: 0
};

// EVMLC controller object
const evmlc = new EVMLC('127.0.0.1', 8080, defaultOptions);
const directory = new DataDirectory('/Users/danu/.evmlc');

// Return generated object
const generateContract = async () => {
	const account = await directory.keystore.decrypt(from, 'asd');
	const contract = await evmlc.generateContractFromABI<CrowdFundingSchema>(ABI, data);

	return contract.deploy(account, {
		parameters: [100000]
	});
};

generateContract()
	.then((contract) => console.log(contract.options))
	.catch((error) => console.log(error))	;

```
