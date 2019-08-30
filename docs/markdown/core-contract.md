# Contract

Contract object helps abstract out the process of working with a smart contract. Using this object you can deploy and interact with functions from the contract.

It is recommended to use wrapper static functions to create and load contract objects.

## `Contract.create`

```typescript
static create<S extends IAbstractSchema>(abi: IContractABI, bytcode: string): Contract<S>
```

```typescript
const { Contract } = require('evm-lite-core');

const contract = Contract.create(ABI, BYTECODE);
```

## `Contract.load`

```typescript
static load<S extends IAbstractSchema>(abi: IContractABI, address: string): Contract<S>
```

```typescript
const { Contract } = require('evm-lite-core');

const contract = Contract.load(ABI, ADDRESS);
```

## `deployTx`

Generates a transaction representing the deployment of a contract.

### Definition (TS)

```typescript
deployTx(parameters: any[], from: string, gas: number, gasPrice: number ): Transaction
```

## `setAddressAndAddFunctions`

Will populate contract functions once an address if set.

### Definition (TS)

```typescript
setAddressAndAddFunctions(address: string): this
```
