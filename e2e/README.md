# Example

The goal of this document is to explain most, if not all, interactions with either an `EVM-Lite` or `Monet` node.

## Table of Contents

1. [Outline](#outline)
2. [Pre-requisites](#pre-requisites)
3. [Importing Keyfile](#importing-keyfile)
4. [Tutorial](#tutorial)

## Outline

We will be building a `smart contract` to handle all the business logic for a crowd funding platform. We will touch on all `Accounts` (from `evm-lite-core`) module functionality as well as deploying `smart contracts` and interacting with its methods.

## Pre-requisites

Before starting we will need either a running `EVM-Lite` or a `Monet` node. If you have not yet started one up, you can visit the installation documentation for [`EVM-Lite`]() or [`Monet`]() to help get started.

You will also need to make sure that you have access to an account with funds on the respective network or node.

It is also advised to have `evmlc` installed. If you have not yet installed the CLI, you can do so by running

```bash
npm install -g evm-lite-cli
```

Documentation of the commands can be found in its [repository]().

### Importing Keyfile

Once you have a node up and running you will need to import the `keyfile` from the configuration directory of the node. The configuration directory location is different for `EVM-Lite` and `Monet` nodes.

If you are running a `Monet` node, depending on your operating system, the `keyfile` should be at

-   Mac OS: `/Users/[user]/Library/MONET/keyfile.json`
-   Linux: `/home/[user]/.monet/keyfile.json`
-   Windows: `?`

and for an `EVM-Lite` node, again depending on your operating system, the `keyfile` should be at

-   Mac OS: `/Users/[user]/Library/EVMLITE/eth/keystore/[FILE_NAME]`
-   Linux: `/home/[user]/.evm-lite/eth/keystore/[FILE_NAME]`
-   Windows: `?`

Once you have the correct `keyfile` path you can import it to the `keystore` directory of `evm-lite-cli` by

```bash
$ evmlc accounts import --file [path]
```

This will make managing the account much simpler.

## Tutorial

The getting started guide can be found [here](tutorial.md).
