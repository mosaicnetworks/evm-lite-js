# EVM-Lite Client

A simple HTTP client for EVM-Lite.

## Constructor

```typescript
constructor(host: string, port: number = 8080)
```

```javascript
const { default: Client } = require('evm-lite-client');

const client = new Client('localhost', 8080);
```

## Methods

### `getReceipt`

Fetches a receipt for a specific transaction hash.

**Definition (TS)**

```typescript
getReceipt(txHash: string): Promise<IReceipt>
```

### `getAccount`

Fetches balance, nonce and bytecode for a specific address.

**Definition (TS)**

```typescript
getAccount(address: string): Promise<IBaseAccount>
```

### `getInfo`

Fetches information about the node.

**Definition (TS)**

```typescript
getInfo(): Promise<any>
```
