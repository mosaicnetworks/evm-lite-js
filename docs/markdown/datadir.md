# EVM-Lite Datadir

A data directory for a client-sided EVM-Lite application takes the following structure:

**Example:** MonetCLI (`~/Library/MONET`)

```console
.
├── keystore
│   ├── node0.json
│   ├── node1.json
│
├── monetcli.toml
```

The keystore is where all keyfiles will be stored and `monetcli.toml` is the configuration file where defaults for connection details and transaction attributes are stored.

This module one default class `DataDirectory` which allows you to interact with the directory structure explained above.

## DataDirectory

### Constructor

The constructor for a `DataDirectory` object takes the following values:

```typescript
constructor(public readonly path: string, configName: string, private readonly keystore: K)
```

Where `K` is any class which extends the `AbstractKeystore` class exposed by `evm-lite-keystore`.

More formally:

```typescript
class DataDirectory<K extends AbstractKeystore>
```

#### Example (ES5)

```javascript
const { default: DataDirectory } = require('evm-lite-core');
const { default: Keystore } = require('evm-lite-keystore');

const keystore = new Keystore('path/to/keystore');
const datadir = new DataDirectory('path/to/directory', 'CONFIG_NAME', keystore);
```

### `readConfig`

Reads the configuration file with the name provided in the constructor for the `DataDirectory` object.

#### Definition (TS)

```typescript
readConfig(): Promise<IConfiguration>
```

### `saveConfig`

Saves a new configuration to the file.

#### Definition (TS)

```typescript
saveConfig(schema: IConfiguration): Promise<void>
```

### `newKeyfile`

Creates a new keyfile with the specified passphrase and places it in the data directories keystore folder.

#### Definition (TS)

```typescript
newKeyfile(moniker: string, passphrase: string, path?: string): Promise<IV3Keyfile>
```

### `getKeyfile`

Fetches a keyfile by moniker from the respective keystore directory.

#### Definition (TS)

```typescript
getKeyfile(moniker: string): Promise<IV3Keyfile>
```

### `listKeyfiles`

Returns an object with the key as `moniker` and the value as the JSON keyfile.

#### Definition (TS)

```typescript
listKeyfiles(): Promise<IMonikerKeystore>
```

### `updateKeyfile`

Updates the passphrase for a keyfile if the old passphrase is known.

#### Definition (TS)

```typescript
updateKeyfile(moniker: string, oldpass: string, newpass: string): Promise<IV3Keyfile>
```

### `importKeyfile`

Imports a specified keyfile to the keystore of the data directory.

#### Definition (TS)

```typescript
importKeyfile(moniker: string, keyfile: IV3Keyfile): Promise<IV3Keyfile>
```
