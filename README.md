# EVM-Lite Javascript Modules

> Javascript modules to interact with an EVM-Lite node

## Installation

There are three main modules to interact with an EVM-Lite.

You can install each one of them depending on the requirements of your project

```bash
npm install evm-lite-core evm-lite-keystore evm-lite-datadir
```

or with `yarn`

```bash
yarn add evm-lite-core evm-lite-keystore evm-lite-datadir
```

Current module versions:

-   `evm-lite-core@1.0.0-alpha.9`
-   `evm-lite-keystore@1.0.0-alpha.9`
-   `evm-lite-datadir@1.0.0-alpha.9`
-   `evm-lite-utils@1.0.0-alpha.9`

_Further module descriptions can be found within thier respective package directories._

## Development

### Prerequisites

First, we will need to install `yarn` as our `npm` client.

```bash
curl -o- -L https://yarnpkg.com/install.sh | bash
```

Another dependency required for development is `lerna.js`.

```bash
yarn global add lerna
```

### Architecture

This repo is a multi-package repository with the higher level `packages/` directory containing each of the packages.

```bash
.
├── packages/
│   ├── core/
│   │   ├── ...
│   ├── datadir/
│   │   ├── ...
│   ├── keystore/
│   │   ├── ...
│   ├── utils/
│   │   ├── ...
│   ├── tsconfig.json
│   └── tsconfig.settings.json
│
├── README.md
├── lerna.json
├── package.json
├── tslint.json
└── yarn.lock
```

The `packages/tsconfig.settings.json` is the root configuration file for typescript. Each of the packages extends this configuration file. It also contains the path mappings for the typescript compiler to locate any symlinked packages from the same repository.

### Installing Dependencies

Only proceed if you have installed `yarn` and `lerna`. If you have not yet installed these, head over to the [pre-requisites](#Prerequisites) section.

In the root directory on this project run

```bash
yarn install
```

This will install all package dependencies including the dependencies of the each of the smaller packages.

It will also run `lerna bootstrap` automatically which will install all their dependencies and linking any cross-dependencies.

All `typescript` files will also be built for each module in their respective `dist/` directory.
