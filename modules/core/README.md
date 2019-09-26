# EVM-Lite Core

[![npm version](https://badge.fury.io/js/evm-lite-core.svg)](https://badge.fury.io/js/evm-lite-core)

<!-- [![CircleCI](https://circleci.com/gh/mosaicnetworks/evm-lite-core/tree/master.svg?style=svg&circle-token=bfc349315e43b3c2b428a19e34f4ed159f459596)](https://circleci.com/gh/mosaicnetworks/evm-lite-core/tree/master) -->

Core library to interact with an EVM-Lite node.

Three classes are exposed as part of this library:

-   [Node](#node)
-   [Account](#account)
-   [Contract](#contract)

The `Account` and `Contract` classes do not have any connection details nor do they have any methods to interact with `EVM-Lite` directly. The only way to interact with the node is to use the methods exposed by `EVMLC` class.

## Installation

You can install this module using `npm`

```bash
npm install evm-lite-core
```

or `yarn`

```bash
yarn add evm-lite-core
```

## Documentation

See documentation [here](https://evm-lite-js.readthedocs.io/en/latest/).

## Developers

See developers docs [here](https://evm-lite-js.readthedocs.io/en/latest/developers.html).
