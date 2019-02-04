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

***Note:*** This library is web compatible.


## Usage

### Create an Account (ES5)


```javascript
const evmlcore = require('evm-lite-core');

// Instansiate EVMLC object
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

// Instansiate EVMLC object
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
