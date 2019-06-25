# EVM-Lite Core

[![npm version](https://badge.fury.io/js/evm-lite-core.svg)](https://badge.fury.io/js/evm-lite-core)
[![CircleCI](https://circleci.com/gh/mosaicnetworks/evm-lite-core/tree/master.svg?style=svg&circle-token=bfc349315e43b3c2b428a19e34f4ed159f459596)](https://circleci.com/gh/mosaicnetworks/evm-lite-core/tree/master)

Core library to interact with an EVM-Lite node.

Three classes are exposed as part of this library:

-   EVMLC
-   Account
-   Contract

The `Account` and `Contract` classes do not have any connection details nor do they have any methods to interact with `EVM-Lite` directly. The only way to interact with the node is to use the methods exposed by `EVMLC` class.

## Installation

You can very simply install `evm-lite-core` using `npm`

```bash
npm install evm-lite-core
```

or `yarn`

```bash
yarn add evm-lite-core
```

## Development

This project was built using `node` version 10.16 (LTS).

To set up the development environment, simply run `npm run dev`. If you want to clean all `dev` files run `npm run clean`.

The `npm run dev` will install all dependecies, compile typescript files into the `dist/` folder and `npm link` the module.

## EVMLC

### Constructor

```typescript
constructor(host: string, port: number)
```

### Methods

#### getAccount

Get an account's `balance` and `nonce` from the node. The returned object will be of the form

```typescript
interface BaseAccount {
	readonly address: string;
	readonly balance: BigNumber;
	readonly nonce: number;
	readonly bytecode: string;
}
```

```typescript
getAccount(address: string): BaseAccount;
```

#### getAccounts

List all controlled accounts on the respective node.

```typescript
getAccounts(): BaseAccount[];
```

#### getReceipt

Fetch the receipt of a given `transaction hash`.

```typescript
getReceipt(hash: string): TransactionReceipt;
```

#### getInfo

Get the information of the connected node.

```typescript
getInfo(): EVMBabbleInfo;
```

#### callTransaction

Submits a non state mutating transaction to the node.

```typescript
callTransaction(tx: Transaction): Response;
```

-   Automtically parses return from any constant/pure contract function

#### submitTransaction

Submits a transaction that mutates state to the node.

```typescript
submitTransaction(tx: Transaction, account: Account): TransactionReceipt;
```

-   Parses any events returned with the receipt
-   Fetches the nonce and appends to transaction before signing

## Accounts

This module can be used to create accounts, prepare a transfer and sign transactions.

### Methods

#### Create

Creates a new keypair.

```typescript
const account = Account.create();
```

```json
{
	"balance": 0,
	"nonce": 0,
	"address": "0x15418f174df69d798b3872BEc30881eaF51d042F",
	"privateKey": "0x33efe4f75e235febd03f212e0735a9e21fb422ce59282348d2b30d1d020e03ac"
}
```

#### prepareTransfer

Creates the transaction object represeting a transfer with the specified attributes.
The `nonce` will be fetched before the submission of the transaction which can be done by creating an instance of `EVMLC` and calling the `.sendTransaction(tx, account)` method with this `Transaction` and the associated signatory `Account`.

```typescript
const transaction = Account.prepareTransfer(
	'FROM_ADDRESS',
	'TO_ADDRESS',
	10000, // value
	100000, // gas
	0 // gasPrice
);
```

```json
{
	"from": "FROM_ADDRESS",
	"to": "TO_ADDRESS",
	"value": 10000,
	"gas": 100000,
	"gasPrice": 0,
	"chainId": 1
}
```

## Contract

This module allows you to deploy new and interact with contracts that already exist.

### Methods

#### create

Creates a new `Contract` and allows for deployment to the network.

```typescript
const contract = Contract.create(/* ABI */ [], 'BYTECODE');

// generate transaction to deploy contract
const transaction = contract.deployTransaction(
	[], // array of all the parameters for the constructor of the contract
	'', // from
	100000, // gas
	0 // gasPrice
);
```

#### load

Loads a contract to interact with.

```typescript
const contract = Contract.load(/* ABI */ [], 'CONTRACT_ADDRESS');

// call methods from contract
const transaction = contract.methods.METHOD_NAME(
	{
		gas: 10000,
		gasPrice: 0
	}, // any transaction attributes must be set here.
	...args // arguments of the contract method
);
```
