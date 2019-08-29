# EVM-Lite DataDir

Data directory management for EVM-Lite applications.

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
