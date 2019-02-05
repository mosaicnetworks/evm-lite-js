# EVM-Lite Core Library

## Installation

To build to library first run:

```bash
npm install
```

then run:

```bash
npm run build
```

Or simply install it from npm:

```bash
npm install evm-lite-core
```

## Usage

### Create an Account (ES5)

```javascript
const evmlcore = require('evm-lite-core');

// Instantiate EVMLC object
const evmlc = new evmlcore.EVMLC('127.0.0.1', 8080, {
    from: '',
    gas: 1000000,
    gasPrice: 0
});


// Create account key pair
const account = evmlc.accounts.create();

// Set default `from` to new account
evmlc.defaultFrom = account.address;
```

### Create an Account (ES6)

```javascript
import { EVMLC } from 'evm-lite-core';

// Instantiate EVMLC object
const evmlc = new EVMLC('127.0.0.1', 8080, {
    from: '',
    gas: 1000000,
    gasPrice: 0
});


// Create account key pair
const account = evmlc.accounts.create();

// Set default `from` to new account
evmlc.defaultFrom = account.address;
```

### Transfer Tokens

```javascript
import { EVMLC } from 'evm-lite-core';

// Instantiate EVMLC object
const evmlc = new EVMLC('127.0.0.1', 8080, {
    from: '',
    gas: 1000000,
    gasPrice: 0
});


// Create account key pair
const account = evmlc.accounts.create();

// Set default `from` to new account
evmlc.defaultFrom = account.address;


async function transfer(value) {
   // Prepare a transfer (returns Promise)
   // `from`, `gas`, `gasPrice` are passed down from the EVMLC object
   const transaction = await evmlc.accounts.prepareTransfer('TO_ADDRESS', 100);

   // Sign the transaction locally
   // await transaction.sign(account);

   // Send transaction
   // await transaction.submit({ timeout: 2 });

   // Could also be done like this with a `timeout` of 2 seconds
   await transaction.submit({ timeout: 2 }, account);

   return transaction;
}
```
