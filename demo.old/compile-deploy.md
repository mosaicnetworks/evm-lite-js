[Overview](README.md) / [Getting Started](getting-started.md) / Compile & Deploy

---

# Compile & Deploy

This document will explain how to compile `contract.sol` and deploy it to a node.

## Compile Script

Create `compile.js` in `src` and paste the following

```javascript
const fs = require('fs');

// solc@0.5.10
const solc = require('solc');

// compile solidity contract
function compile(contractPath, contractName) {
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

module.exports = compile;
```

This function should compile a contract and return the `ABI` and `bytecode` which will be used to interact and deploy the contract.

## Deployment

Now that we have a function to compile the contract we can now construct the `Contract` object from `evm-lite-core` and prepare it for deployment.

Create `index.js` in `src` and paste the following

```javascript
const path = require('path');

// import required objects
const { EVMLC, Contract } = require('evm-lite-core');

// account address
const address = '0x07BA865451D9417714E8Bb89e715ACBc789A1Bb7';
const password = 'asdasd';
const defaultGas = 10000000;
const defaultGasPrice = 0;

// compile function
const compile = require('./compile');

// host and port of the running node
// the port should be the `service` port described in EVM-Lite
// client to node
const node = new EVMLC('127.0.0.1', 8080);

// compile contract
const compiled = compile(path.join(__dirname, 'contract.sol'), 'CrowdFunding');

// Generate contract abstraction object
const contract = Contract.create(compiled.abi, compiled.bytecode);
```

Now that we have the initial set up the deployment script set up, we will need to set up our `datadir` objects to read and decrypt accounts used to sign transactions.

```javascript
// ...

// import keystore and datadirectory objects
const { Keystore } = require('evm-lite-keystore');
const { DataDirectory } = require('evm-lite-datadir');

// initialize classes
const datadirPath = '/Users/danu/.evmlc';
const datadir = new DataDirectory(datadirPath);

// for `evmlc` keystore directory is a child of datadir
const keystore = new Keystore(path.join(datadirPath, 'keystore'));

// set the keystore object as the keystore for datadir object
datadir.setKeystore(keystore);
```

We can now read our account and decrypt it using the function below

```javascript
// ...

// get account by address and decrypt with pass
const getAccount = async (address, password) => {
	// wait for keyfile to resolve
	const keyfile = await datadir.keystore.get(address);

	// return the decrypted account
	return Keystore.decrypt(keyfile, password);
};
```

Now that we have the scaffolding set up to deploy a contract, we can write a function to just that

```javascript
// ...

const deployContract = async (account, goal) => {
	// generate deploy transaction
	const deployTransaction = contract.deployTransaction(
		[goal],
		account.address,
		defaultGas,
		defaultGasPrice
	);

	// wait for deployment and return receipt
	return await node.sendTransaction(deployTransaction, account);
};
```

Since all requests to the now are `async` we will need to wrap our logic in an `async` function.

```javascript
// ...

const run = async () => {
	// fetch account and decrypt
	const account = await getAccount(address, password);

	// deploy contract with a goal of 1000
	const receipt = await deployContract(account, 1000);

	// populate contract functions and set contract address
	contract.setAddressAndAddFunctions(receipt.contractAddress);

	return 'done';
};

run()
	.then(console.log)
	.catch(console.log);
```

Now running

```bash
$ node src/index.js
```

Should deploy the contract, fetch the receipt and set the newly generated contract address to the contract object and populate all methods of the contract within `contract.methods`.

## Interacting with Contract Methods

Interacting with contract methods are outlined [here](interacting-contract.md).
