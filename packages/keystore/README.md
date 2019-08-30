# EVM-Lite Keystore

[![npm version](https://badge.fury.io/js/evm-lite-keystore.svg)](https://badge.fury.io/js/evm-lite-keystore)

Keystore management for any EVM-Lite applications.

## Installation

You can very simply install `evm-lite-keystore` using `npm`

```bash
npm install evm-lite-keystore
```

or `yarn`

```bash
yarn add evm-lite-keystore
```

## Developement

An abstract implementation of the `Keystore` module is exposed by `AbstractKeystore`. Using this class you can create your own keystore management module.

As an example please refer to `src/Keystore.ts`.

## Methods

### `constructor`

```typescript
constructor(path: string)
```

#### Example

```typescript
const keystore = new Keystore('<HOME_DIR>/.evmlc/keystore');
```

### `list`

Should list all `V3Keyfile` files in the directory specified in the constructor.

```typescript
list(): Promise<MonikerKeystore>
```

#### Example

```typescript
keystore
	.list()
	.then(console.log)
	.catch(console.log);
```

### `get`

Should get a single `V3Keyfile` file.

```typescript
get(moniker: string): Promise<V3Keyfile>
```

#### Example

```typescript
keystore
	.get('moniker')
	.then(console.log)
	.catch(console.log);
```

### `create`

Should create a `V3Keyfile` encrypted with the password specified and place in the directory.

```typescript
create(moniker: string, password: string, overridePath?: string): Promise<V3Keyfile>
```

#### Example

```typescript
keystore
	.create('supersecurepassword')
	.then(console.log)
	.catch(console.log);
```

### `decrypt`

Should decrypt a `V3Keyfile` with the ecrypted password.

```typescript
decrypt(keyfile: V3Keyfile, password: string): Account
```

#### Example

```typescript
keystore
	.get('moniker')
	.then(keyfile => keystore.decrypt(keyfile, 'supersecurepassword'))
	.then(console.log)
	.catch(console.log);
```
