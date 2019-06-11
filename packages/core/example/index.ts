// const { Account, EVMLC, Contract } = require('evm-lite-core');
import { Account, Contract, EVMLC } from 'evm-lite-core';
// create a client to the node
const node = new EVMLC('localhost', 8080);

// privKey: 0xc66c285ac9429c0cdf8519249864c3d00345941d4f12694d6ca9deda27456d28
// address: 0x38e5Dde109D26054606E2e84e4ff3C71BefC74fc
const account = Account.fromPrivateKey(
	'0xc66c285ac9429c0cdf8519249864c3d00345941d4f12694d6ca9deda27456d28'
);

const example = async () => {
	// get account details
	const details = await node.getAccount(account.address);

	// prepare a transfer to another address for 1000
	const transferTransaction = Account.prepareTransfer(
		account.address, // from
		'OTHER_ADDRESS', // to
		1000, // value
		10000, // gas
		0 // gasPrice
	);

	// submit the transfer transaction to the node
	// the returned object is the receipt
	const transferReceipt = await node.sendTransaction(
		transferTransaction,
		account
	);

	// create a new contract object to deploy
	// the first parameter is the `ABI` for the respective contract
	const contract = Contract.create([], 'BYTECODE');

	// create the deploy transaction for the contract
	const deployTransaction = contract.deployTransaction(
		/* Constructor Params */ [],
		account.address, // from
		10000000, // gas
		0 // gasPrice
	);

	// submit the deploy transaction to the node
	// checks will be performed by this function to ensure
	// the account used to sign has the same address as the
	// `from` in the transaction
	const deployReceipt = await node.sendTransaction(
		deployTransaction,
		account
	);

	// you can access the contract methods throught the `.methods` property
	const methodsArguments = []; // list all methods arguments
	const methodTransaction = contract.methods.METHOD_NAME(
		{
			from: account.address,
			// Methods used from the contract object have the contract
			// address set as the `to` automatically
			to: contract.address,
			gas: 1000000,
			gasPrice: 0
			// other tx attributes
		},
		...methodsArguments
	);

	// submit method transaction to the node
	// if the methods fires events off they will automatically be
	// parsed and returned with the receipt.
	const methodReceipt = await node.sendTransaction(
		methodTransaction,
		account
	);
};

example().catch(console.log);
