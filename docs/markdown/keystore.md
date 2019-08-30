# EVM-Lite Keystore

Keystore management for any EVM-Lite applications.

## Keystore

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
