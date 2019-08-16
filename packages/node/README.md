# EVMLC

## `constructor`

```typescript
constructor(host: string, port: number = 8080, consensus?: TConsensus)
```

### Methods

#### `getAccount`

Get an account's `balance` and `nonce` from the node. The returned object will be of the form

```typescript
interface IBaseAccount {
	readonly address: string;
	readonly balance: BigNumber | number;
	readonly nonce: number;
	readonly bytecode: string;
}
```

```typescript
getAccount(address: string): IBaseAccount;
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
