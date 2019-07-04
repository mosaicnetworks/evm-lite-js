# Crowd Funding Example

We will deploy a crowd funding smart contract and learn how to call functions from that contract using `evm-lite-js` modules.

## Pre-requisites

Before you begin you will need to make sure you have [`node`](https://nodejs.org/en/) installed (ideally `10.16 LTS`). Also to make managing `npm` packages much cleaner, you should be using `yarn` as your npm client
(_optional_).

To install `yarn` you can simply run

```bash
curl -o- -L https://yarnpkg.com/install.sh | bash
```

_If you have any questions about `yarn`, you can read their documentation [here](https://yarnpkg.com/lang/en/docs/)_

### Account

You will also need to make sure that you have an account with a balance of atleast `100` to proceed with this demo.

I will be using the account corresponding to the private key

```console
0x83019a76a9c90bcd7a93e228b71b9ebc104bcbfed6cd2d54c66fb010005c1008
```

## Project Set Up

Firstly we need to need to create a directory to hold all the project files. We will create a directory named `crowd-funding-demo` on our `Desktop`.

```
~/Desktop$ mkdir crowd-funding-demo
```

Then we need to `init` a package.json to specify dependencies for this project. We can do this by running `yarn init -y`.

```json
{
	"name": "crowd-funding-demo",
	"version": "1.0.0",
	"main": "index.js",
	"license": "MIT"
}
```

We will need to create one more directory and a file to get started. The directory structure of the project should look something like this.

```console
.
├── package.json
└── src
    └── index.js
```

We will also need to change the value of `main` attribute in `package.json` to `src/index.js`.
Finally we will install all relevant `evm-lite-js` modules and `solc@0.5.8` as `dependencies`

```bash
yarn add evm-lite-core evm-lite-keystore solc@0.5.8
```

Our `package.json` should look like this

```json
{
	"name": "crowd-funding-demo",
	"version": "1.0.0",
	"main": "index.js",
	"license": "MIT",
	"dependencies": {
		"evm-lite-core": "^1.0.0-alpha.8",
		"evm-lite-keystore": "^1.0.0-alpha.8",
		"solc": "0.5.8"
	}
}
```

## Demo

First we create `src/contract.sol` and add the following lines of code

```javascript
pragma solidity ^0.5.8;

contract CrowdFunding {
    struct Funder {
        address addr;
        uint amount;
    }

    struct Campaign {
        address payable beneficiary;
        uint fundingGoal;
        uint numFunders;
        uint amount;
    }

    Campaign campaign;

    event NewContribution(
        address beneficiary,
        address funder,
        uint amount
    );

    event Settlement(
        bool ok
    );

    constructor(uint goal) public {
        campaign = Campaign({
            beneficiary: msg.sender,
            fundingGoal: goal,
            numFunders: 0,
            amount: 0
        });
    }

    function contribute() public payable {
        campaign.amount += msg.value;

        emit NewContribution(campaign.beneficiary, msg.sender, msg.value);
    }

    function checkGoalReached() public view returns (
        bool reached,
        address beneficiary,
        uint goal,
        uint amount
    ) {
        if (campaign.amount < campaign.fundingGoal)
            return (
                false,
                campaign.beneficiary,
                campaign.fundingGoal,
                campaign.amount
            );
        else
            return (
                true,
                campaign.beneficiary,
                campaign.fundingGoal,
                campaign.amount
            );
    }

    function settle() public payable {
        if (campaign.amount >= campaign.fundingGoal) {
            uint am = campaign.amount;

            campaign.amount = 0;
            campaign.beneficiary.transfer(am);

            emit Settlement(true);
        } else {
            emit Settlement(false);
        }
    }
}
```

We need need to compile this contract using `solc@0.5.8`. So lets create `src/compile.js` and add the following

```javascript
const fs = require('fs');
const path = require('path');
const solc = require('solc');

function compile(contractName, fileName) {
	const contractPath = path.join(path.resolve(__dirname), `${fileName}.sol`);

	const input = {
		language: 'Solidity',
		sources: {
			Contracts: {
				content: fs.readFileSync(contractPath, 'utf8')
			}
		},
		settings: {
			outputSelection: {
				'*': {
					'*': ['*']
				}
			}
		}
	};

	const output = JSON.parse(solc.compile(JSON.stringify(input)));
	const compiledContract = output.contracts.Contracts[`${contractName}`];

	return {
		bytecode: compiledContract.evm.bytecode.object,
		abi: compiledContract.abi
	};
}

module.exports = compile;
```

Now that we have the basic building blocks down, we can now compile the contract and get the `bytecode` and `ABI` (Application Binary Interface) to deploy and interact with it.

In `src/index.js` we will need to import `compile` and then create a `Contract` object from `evm-lite-core`

```javascript
// Imports from `evm-lite-js` modules
const { Contract, EVMLC, Account } = require('evm-lite-core');

const account = Account.fromPrivateKey(
	'0x83019a76a9c90bcd7a93e228b71b9ebc104bcbfed6cd2d54c66fb010005c1008'
);

// Compile function
const compile = require('./compile');

// Compile contract and return ABI and Bytecode
const compiled = compile('CrowdFunding', 'contract');

// Create contract
const crowdFunding = Contract.create(compiled.abi, compiled.bytecode);
```

Now we can use the abstraction provided by `Contract` to generate the deployment transaction

```javascript
// Deployment transaction
const deployTx = crowdFunding.deployTransaction([1000], 'FROM', 10000000, 0);
```

In order to submit this transaction we will need to create a client to the node. This can be done by importing `EVMLC` from `evm-lite-core`

```javascript
// Client to node
const node = new EVMLC('127.0.0.1', 8080);
```

We can now `send` the transaction to the node. The return will be a `Promise` and will resolve a `Transaction Receipt`

```javascript
node.sendTransaction(deployTx, account)
	.then(console.log)
	.catch(console.log);
```

```json
{"root":"0x44154fda629bf8f517542c067199797940e6e36887705db53da4f9b4d7f05d7a","transactionHash":"0x51670362956482fd959b52c934404668dc3da2be7c4490de10b1956d62cd3989","from":"0xf2c00bde8825212ea94cd681
94b2096a31f0c704","to":null,"gasUsed":320820,"cumulativeGasUsed":320820,"contractAddress":"0x9f91957b85d588773583e11abc2fdbea4ad60869","logs":[],"logsBloom":"0x00000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000000000000000000000","status":0}
```

Notice how a `contractAddress` was returned with the receipt. We now need to set the `contractAddress` to our `crowdFunding` contract object.

```javascript
// set contract address and populate functions
crowdFunding.setAddressAndAddFunctions(
	'0x9f91957b85d588773583e11abc2fdbea4ad60869'
);
```
