# EVM-Lite DataDir

[![npm version](https://badge.fury.io/js/evm-lite-datadir.svg)](https://badge.fury.io/js/evm-lite-datadir)

Data directory management for EVM-Lite applications.

## Installation

You can very simply install `evm-lite-datadir` using `npm`

```bash
npm install evm-lite-datadir
```

or `yarn`

```bash
yarn add evm-lite-datadir
```

## Usage

```javascript
// import
const { default: DataDirectory } = require('evm-lite-datadir');
const { default: Keystore } = require('evm-lite-keystore');

// generate objects
const keystore = new Keystore('path/to/keystore/');
const datadir = new DataDirectory('path/to/data/dir', 'configName', keystore);

datadir
	.readConfig()
	.then(console.log)
	.catch(console.log);
```
