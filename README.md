# EVM-Lite Library

[![](https://img.shields.io/npm/v/@cycle/core.svg)](https://www.npmjs.com/package/evm-lite-lib)

A javascript library to interact with EVM-Lite.

## Installation

The easiest way to install `evm-lite-lib` is by using `npm`:

```console
npm install evm-lite-lib
```

Note: Type definitions are provided for Typescript users.

## Example

Below is a basic exmaple of how to transfer from a an account on the node.

```typescript
const from = '0xA4a5F65Fb3752b2B6632F2729f17dd61B2aaD650';
const to = '0x5204302336b6634db77dbaca147918bdaed8b0e7';

const evmlc = new EVMLC('127.0.0.1', 8080, {
    from,
    gas: 100000,
    gasPrice: 0
});

const transaction = evmlc.prepareTransfer(to, 2000000);

evmlc.getAccount(to)
    .then((account) => console.log('Account Before:', account, '\n\n'))
    .then(() => transaction.send())
    .then((receipt) => console.log('Transaction Receipt:', receipt, '\n\n'))
    .then(() => evmlc.getAccount(to))
    .then((account) => console.log('Account After:', account, '\n\n'))
    .catch((error) => console.log(error))
```