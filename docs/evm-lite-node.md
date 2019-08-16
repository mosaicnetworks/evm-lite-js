# EVM-Lite Node

This module exports a default class to interact with an `evm-lite` node.

## `constructor`

```typescript
constructor(host: string, port: number = 8080, consensus?: TConsensus)
```

### Methods

#### `getAccount`

Get an account's `balance` and `nonce` from the node.

##### Definition (TS)

```typescript
getAccount(address: string): IBaseAccount;
```

##### Usage

```typescript
const node = new Node('localhost');

node.getAccount('0xa10aae5609643848fF1Bceb76172652261dB1d6c')
	.then(console.log)
	.catch(console.log);
```

```javascript
{
	"address": "0xa10aae5609643848fF1Bceb76172652261dB1d6c",
	"balance": 0,
	"nonce": 0,
	"bytecode": ""
}
```

#### `getReceipt`

Fetch the receipt of a given `transaction hash`.

```typescript
getReceipt(hash: string): IReceipt;
```

#### `getInfo`

Get the information of the connected node.

```typescript
getInfo(): object;
```

#### `callTransaction`

Submits a non state mutating transaction to the node.

```typescript
callTransaction<R>(tx: Transaction): R;
```

-   Automtically parses return from any constant/pure contract function

#### `sendTransaction`

Submits a transaction that mutates state to the node.

```typescript
sendTransaction(tx: Transaction, account: Account): IReceipt;
```

-   Parses any events returned with the receipt
-   Fetches the nonce and appends to transaction before signing
