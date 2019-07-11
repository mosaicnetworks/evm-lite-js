# Interacting with Contract Methods

## Contribute

We will now attempt to contribute `1001` tokens to the `CrowdFunding` contract. Interacting with contracts are very simple with the `Contract` object. All methods of the contract are contained within the `.methods` attribute.

In `src/index.js` modify the `.run()` function

```javascript
const run = async () => {
	// ...

	// now we can interact with the contract through
	// contribute 1001 to crowdFunding
	const contributeTransaction = contract.methods.contribute({
		from: account.address,
		gas: defaultGas,
		gasPrice: defaultGasPrice,
		value: 1001
	});

	// submit to node and get receipt
	const contributeReceipt = await node.sendTransaction(
		contributeTransaction,
		account
	);

	// logs are automatically parsed from the receipt
	// so we can parse how much we contributed to make sure
	console.log(
		'Contributed: ',
		contributeReceipt.logs[0].args.amount.toNumber()
	);

	return 'done';
};

run()
	.then(console.log)
	.catch(console.log);
```

The function will deploy a contract, populate the methods of the contract under `.methods` then attempt to `contribute()` `1001` tokens to the contract. We can also see that the `Receipt` returned from the submission of the transaction has its `Logs` parsed automatically.

## Check Goal

Since we have contributed `1001` tokens to the contract whos initial goal was `1000` tokens, we should see that the `checkGoalReached()` methods should return `true`.

Again extending the `run()` methods further

```javascript
const run = async () => {
	// ...

	// check if goal reached
	// notice no from address is needed as its a `view` transaction
	const checkGoalTransaction = contract.methods.checkGoalReached({
		gas: defaultGas,
		gasPrice: defaultGasPrice
	});

	const checkGoalResponse = await node.callTransaction(checkGoalTransaction);

	console.log('Goal Reached: ', checkGoalResponse[0]);

	return 'done';
};

run()
	.then(console.log)
	.catch(console.log);
```

We should see that the target we set initially of `1000` should have been met when running

```bash
$ node src/index
```

## Settle

Now that the goal we set has been reached, we will need to `settle()` the amount to the beneficiary.

Futher extending the `run()` function, we get

```javascript
const run = async () => {
	// ...

	// generate transaction to settle amount to beneficiary
	// from address is needed as this is a payable transaction
	const settleTransaction = contract.methods.settle({
		from: account.address,
		gas: defaultGas,
		gasPrice: defaultGasPrice
	});

	// send settle transaction
	const settleReceipt = await node.sendTransaction(
		settleTransaction,
		account
	);

	// logs are automatically parsed from the receipt
	console.log(settleReceipt.logs[0].args.ok);

	return 'done';
};

run()
	.then(console.log)
	.catch(console.log);
```

We should see that the contributed amount be transferred back to the beneficiary.

## Conclusion

The final `index.js`

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

// get account by address and decrypt with pass
const getAccount = async (address, password) => {
	// wait for keyfile to resolve
	const keyfile = await datadir.keystore.get(address);

	// return the decrypted account
	return Keystore.decrypt(keyfile, password);
};

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

const run = async () => {
	// fetch account and decrypt
	const account = await getAccount(address, password);

	// deploy contract with a goal of 1000
	const receipt = await deployContract(account, 1000);

	// populate contract functions and set contract address
	contract.setAddressAndAddFunctions(receipt.contractAddress);

	// now we can interact with the contract through
	// contribute 1001 to crowdFunding
	const contributeTransaction = contract.methods.contribute({
		from: account.address,
		gas: defaultGas,
		gasPrice: defaultGasPrice,
		value: 1001
	});

	// submit to node and get receipt
	const contributeReceipt = await node.sendTransaction(
		contributeTransaction,
		account
	);

	// logs are automatically parsed from the receipt
	console.log(
		'Contributed: ',
		contributeReceipt.logs[0].args.amount.toNumber()
	);

	// check if goal reached
	// notice no from address is needed as its a `view` transaction
	const checkGoalTransaction = contract.methods.checkGoalReached({
		gas: defaultGas,
		gasPrice: defaultGasPrice
	});

	const checkGoalResponse = await node.callTransaction(checkGoalTransaction);

	console.log('Goal Reached: ', checkGoalResponse[0]);

	// generate transaction to settle amount to beneficiary
	// from address is needed as this is a payable transaction
	const settleTransaction = contract.methods.settle({
		from: account.address,
		gas: defaultGas,
		gasPrice: defaultGasPrice
	});

	// send settle transaction
	const settleReceipt = await node.sendTransaction(
		settleTransaction,
		account
	);

	// logs are automatically parsed from the receipt
	console.log(settleReceipt.logs[0].args.ok);

	return 'done';
};

run()
	.then(console.log)
	.catch(console.log);
```
