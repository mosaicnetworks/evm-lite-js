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
const path = require('path');

// DataDirectory class
const { DataDirectory } = require('evm-lite-datadir');

// Creates the provided path if it does not exist
const datadir = new DataDirectory('/Users/danu/.evmlc');

// Current configuration data for this data directory
// stored in '[datadir]/config.toml'
console.log(datadir.config.state);

// `DataDirectory` has a `keystore` attribute is a generic type which
// extends the `AbstractKeystore` class in `evm-lite-keystore`
// You can set a keystore directory by initialising the generic class
const { Keystore } = require('evm-lite-keystore');

datadir.setKeystore(new Keystore(path.join(datadir.path, 'keystore')));
```

For more information on methods exposed by `Keystore` refer to [here](../keystore).
