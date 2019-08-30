# Account

Account object allows you to sign transactions, create new keypairs and generate an `Account` object from a private key.

## `Account.new`

```javascript
const { Account } = require('evm-lite-core');

const account = Account.new();
```

## `fromPrivateKey`

Generates an account object based on a private key.

### Definition (TS)

```typescript
static fromPrivateKey(privateKey: string): Account;
```

## `signTx`

Signs a transaction with the respective private key.

### Definition (TS)

```typescript
signTx(tx: ITransaction): ISignedTx
```
