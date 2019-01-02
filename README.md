# EVM-Lite Library

[![npm version](https://badge.fury.io/js/evm-lite-lib.svg)](https://badge.fury.io/js/evm-lite-lib)

A javascript library to interact with EVM-Lite.

## Installation

To install `evm-lite-lib` by using `npm`:

```console
npm install evm-lite-lib
```

Note: Type definitions are provided for Typescript users.

## Example

Below is a basic example of how to transfer from a controlled account.

```typescript
const evmlib = require('evm-lite-lib');

const from = '0xb1A28a3BCb7899647108cb3C19a211F1DD09B94E';
const to = '0x1dEC6F07B50CFa047873A508a095be2552680874';

let evmlc = new evmlib.EVMLC('127.0.0.1', 8080, {
	from,
	gas: 100000,
	gasPrice: 0
});

const transactionPrepare = evmlc.prepareTransfer(to, 200);

evmlc.getAccount(to)
	.then((account) => {
		console.log('Account Before:', account, '\n\n')
		return transactionPrepare
	})
	.then((transaction) => transaction.send())
	.then((receipt) => console.log('Transaction Receipt:', receipt, '\n\n'))
	.then(() => evmlc.getAccount(to))
	.then((account) => console.log('Account After:', account, '\n\n'))
	.catch((error) => console.log(error));
```
