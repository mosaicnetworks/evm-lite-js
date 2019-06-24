# EVM-Lite Library

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

### Architecture ([Monorepo](https://en.wikipedia.org/wiki/Monorepo))

We will follow a software development strategy known as a `monorepo`.

There are several potential advantages to a monorepo over individual repositories:

-   Ease of code reuse – Similar functionality or communication protocols can be abstracted into shared libraries and directly included by projects, without the need for a dependency package manager.
-   Simplified dependency management – In a multiple repository environment where multiple projects depend on a third-party dependency, that dependency might be downloaded or built multiple times. In a monorepo the build can be easily optimized, as referenced dependencies all exist in the same codebase.
-   Atomic commits – When projects that work together are contained in separate repositories, releases need to sync which versions of one project work with the other. And in large enough projects, managing compatible versions between dependencies can become dependency hell. In a monorepo this problem can be negated, since developers may change multiple projects atomically.
-   Large-scale code refactoring – Since developers have access to the entire project, refactors can ensure that every piece of the project continues to function after a refactor.
-   Collaboration across teams – In a monorepo that uses source dependencies (dependencies that are compiled from source), teams can improve projects being worked on by other teams. This leads to flexible code ownership.

We have a higher level `packages/` directory which contains each of the packages.

```bash
.
├── packages/
│   ├── core/
│   │   ├── ...
│   ├── datadir/
│   │   ├── ...
│   ├── keystore/
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

The `packages/tsconfig.settings.json` is the root configuration file for typescript. Each of the packages extends this configuration file. It also contains the path mappings for the typescript compiler to locate any symlinked packages from the same `monorepo`.

### Installing Dependencies

Only proceed if you have installed `yarn` and `lerna`. If you have not yet installed these, head over to the [pre-requisites](#Prerequisites) section.

In the root directory on this project run

```bash
yarn install
```

This will install all package dependencies including the dependencies of the each of the smaller packages.

Now we will need to symlink all related packages to each other

```bash
lerna bootstrap
```

Bootstrap the packages in the current Lerna repo. Installing all their dependencies and linking any cross-dependencies.

This command is crucial, as it allows you to use your package names in require() as if the packages were already existing and available in your node_modules folder.

We will need to transpile all the `Typescript` files to `Javascript` for each of the packages

```bash
lerna run compile
```
