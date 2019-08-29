# EVM-Lite Core

This is the core module to interact with an EVM-Lite or Monet node. It exposes classes which help interact with contracts, accounts, transactions and the node itself.

There are three main objects exposed as part of this library:

-   [`Node`](#node)
-   [`Contract`](#contract)
-   `Account`
-   `Transaction`

_Only the `Node` class has the functionality to send requests to the node._

## Node

A node is essentially a wrapper around a client to access EVM-Lite specific endpoints as well as the underlying consensus.

### Constructor

The constructor for a node object takes the following values:

```typescript
constructor(host: string, port: number = 8080, consensus: TConsensus)
```

Where `TConsensus` is any class which extends the `IAbstractConsensus` class exposed by `evm-lite-consensus`.

More formally:

```typescript
class Node<TConsensus extends IAbstractConsensus>
```

#### Example (ES5)

```javascript
const { default: Node } = require('evm-lite-core');
const { Babble } = require('evm-lite-consensus');

const babble = new Babble('127.0.0.1', 8080);
const node = new Node('127.0.0.1', 8080, babble);
```

### `sendTx`

Submits a transaction that mutates state to the node.
Any events return by contract functions will be parsed by default for all transactions.

**Definition (TS)**

```typescript
sendTx(tx: Transaction, account: Account): Promise<IReceipt>
```

### `transfer`

Transfers the specified number of tokens to another address.

**Definition (TS)**

```typescript
transfer(from: Account, to: string, value: number, gas: number, gasPrice: number): Promise<IReceipt>
```

**Example (ES5)**

```javascript
const { Account } = require('evm-lite-core');

// Create account object from private key
const account = Account.fromPrivateKey('PRIVATE_KEY');

// First parameter if of type `Account`
node.transfer(account, 'TO_ADDRESS', 1000, 100000000, 0)
	.then(receipt => console.log(receipt))
	.catch(console.log);
```

### `callTx`

Submits a transaction that does **not** mutate state to the node.

**Definition (TS)**

```typescript
callTx<R>(tx: Transaction): Promise<R>
```

### `getAccount`

Fetches account balance, nonce, and bytecode for a specified address

**Definition (TS)**

```typescript
getAccount(address: string): Promise<IBaseAccount>
```

**Example (ES5)**

```javascript
node.getAccount('0x9f640e0930370ff42c9b0c7679f83d4c7f3f98cd')
	.then(account => console.log(account))
	.catch(console.log);
```

## Contract

Contract object helps abstract out the process of working with a smart contract. Using this object you can deploy and interact with functions from the contract.

It is reccomended to use wrapper static functions to create and load contract objects.

`Contract.create`

```typescript
static create<S extends IAbstractSchema>(abi: IContractABI, bytcode: string): Contract<S>
```

```typescript
const { Contract } = require('evm-lite-core');

const contract = Contract.create(ABI, BYTECODE);
```

`Contract.load`

```typescript
static load<S extends IAbstractSchema>(abi: IContractABI, address: string): Contract<S>
```

```typescript
const { Contract } = require('evm-lite-core');

const contract = Contract.load(ABI, ADDRESS);
```

### `deployTx`

Generates a transaction representing the deployment of a contract.

**Definition (TS)**

```typescript
deployTx(parameters: any[], from: string, gas: number, gasPrice: number ): Transaction
```

### `setAddressAndAddFunctions`

Will populate contract functions once an address if set.

**Definition (TS)**

```typescript
setAddressAndAddFunctions(address: string): this
```
