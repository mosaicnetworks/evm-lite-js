# Compile & Deploy

This document will explain how to compile `contract.sol` and deploy it to a node.

## Compile Script

Create `compile.js` in `src` and paste the following

```javascript
// import solc compiler
const solc = require('solc');

const compile = (path, contractName) => {

    // read contract from path
    const input = fs.readFileSync(path);

    // compile contract
    const output = solc.compile(input.toString(), 1);

    // return abi and bytecode
    return {
        bytecode: output.contracts[`:${contractName}`].bytecode,
        abi: output.contracts[`:${contractName}`].interface;
    }

};

export default compile;
```

This function should compile a contract and return the `ABI` and `bytecode` which will be used to interact and deploy the contract.

## Deployment

Now that we have a function to compile the contract we can now contruct the `Contract` object from `evm-lite-core` and prepare it for deployment.

Create `index.js` in `src` and paste the following

```javascript
const path = require('path');

// import required objects
const { EVMLC, Contract } = require('evm-lite-core');

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
const { DataDirectory } = require('evm-lite-keystore');

// initialize classes
const datadirPath = '[home_dir]/.evmlc';
const datadir = new DataDirectory(datadirPath);

// for `evmlc` keystore directory is a child of datadir
const keystore = new Keystore(path.join(datadirPath, 'keystore'));

// set the keystore object as the keystore for datadir object
datadir.setKeystore(keystore);
```

We can now read in accounts and decrypt them. The address I will be using is `0x07BA865451D9417714E8Bb89e715ACBc789A1Bb7`.

```javascript
// ...

const getAccount = async address => {
	// wait for keyfile to resolve
	const keyfile = await datadir.keystore.get(address);

	// return the decrypted account
	return Keystore.decrypt(keyfile, 'password');
};
```

now
