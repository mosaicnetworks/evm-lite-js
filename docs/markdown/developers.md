# Developers

## Prerequisites

First, we will need to install `yarn` as our `npm` client.

```bash
curl -o- -L https://yarnpkg.com/install.sh | bash
```

## Architecture

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
│   ├── consensus/
│   │   ├── ...
│   ├── client/
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

## Installing Dependencies

Only proceed if you have installed `yarn` and `lerna`. If you have not yet installed these, head over to the [pre-requisites](#Prerequisites) section.

In the root directory on this project run

```bash
yarn install
```

This will install all package dependencies including the dependencies of the each of the smaller packages.

It will also run `lerna bootstrap` automatically which will install all their dependencies and linking any cross-dependencies.

All `typescript` files will also be built for each module in their respective `dist/` directory.

## Linking & Unlinking

To link all dependencies using `yarn link`, simply run `yarn linkall`. If you wish to unlink all dependencies run `yarn unlinkall`.
