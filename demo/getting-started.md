[Overview](README.md) / Getting Started

---

# Getting Started

This document will outline the steps to set-up a `Node.js` project with the requirements to start building a `Crowd Funding` platform.

## Table of Contents

1. [Set Up](#set-up)
2. [Check Accounts](#check-accounts)
3. [Setting Up Contract](#Setting-Up-Contract)
4. [Compiling & Deploying](#compiling-and-deploying)
5. [Interacting with Contract Methods](#interacting-with-contract-methods)

## Set Up

Firstly we will need to set up a `Node.js` project and add the required dependencies. You can create the main project folder anywhere but for the purpose of this tutorial, I will create it on my `Desktop` and name it `crowd-funding`

```bash
$ mkdir -p ~/Desktop/crowd-funding && cd ~/Desktop/crowd-funding
```

We will also need to create a source folder to hold all our source files

```bash
$ mkdir src
```

Inside the root project folder run

```bash
$ npm init -y
```

This will initialize a barebones `package.json` file. We can now install all the required dependencies by

```bash
$ npm install evm-lite-core evm-lite-keystore evm-lite-datadir evm-lite-utils solc@0.5.10
```

This will install all `evm-lite-js` modules as well as the `Solidity` compiler `solc`.

## Check Accounts

Now that we have a running node (`Monet` or `EVM-Lite`), we will need to verify that the account we will be dealing with has enough funds. We can use the CLI to speed up the process of this by running

```bash
$ evmlc accounts list

.-----------------------------------------------------------------------------.
|                  Address                   |        Balance         | Nonce |
|--------------------------------------------|------------------------|-------|
| 0x07BA865451D9417714E8Bb89e715ACBc789A1Bb7 | 1234000000000000000000 |     0 |
'-----------------------------------------------------------------------------'
```

## Setting Up Contract

Create a file `contract.sol` in `src` and paste the following

```javascript
pragma solidity ^0.5.10;

contract CrowdFunding {
    // Defines a new type with two fields.
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
        // Creates new struct and saves in storage.
        campaign = Campaign({
            beneficiary: msg.sender,
            fundingGoal: goal,
            numFunders: 0,
            amount:0});
    }

    function contribute() public payable {
        campaign.amount += msg.value;

        emit NewContribution(campaign.beneficiary, msg.sender, msg.value);
    }

    function checkGoalReached() public view returns (bool reached, address beneficiary, uint goal, uint amount) {
        if (campaign.amount < campaign.fundingGoal)
            return (false, campaign.beneficiary, campaign.fundingGoal, campaign.amount);
        else
            return (true, campaign.beneficiary, campaign.fundingGoal, campaign.amount);
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

This contract has three functions and one constructor. We will deploy this contract with a funding goal of `1000` tokens and call `contribute()`, `checkGoalReached()` and `settle()` with the help of `evm-lite-js`.

## Compiling and Deploying

The compiling and deploying guide can be found [here](compile-deploy.md).

## Interacting with Contract Methods

Details on how to interact with contract methods can be found [here](interacting-contract.md).
