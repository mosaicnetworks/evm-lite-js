# Crowd Funding Example

We will deploy a crowd funding smart contract and learn how to call functions from that contract using `evm-lite-js` modules.

## Pre-requisites

Before we begin we will need to make sure we have [`node`](https://nodejs.org/en/) installed (ideally `10.16 LTS`). Also to make managing `npm` packages much cleaner, we will be using `yarn` as our npm client.

To install `yarn` we can simply run

```bash
curl -o- -L https://yarnpkg.com/install.sh | bash
```

_If you have any questions about `yarn`, you can read their documentation [here](https://yarnpkg.com/lang/en/docs/)_

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
import * as fs from 'fs';
import * as path from 'path';
import * as solc from 'solc';

export default function compile(contractName, fileName) {
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
```
