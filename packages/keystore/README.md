# EVM-Lite Keystore

Keystore management for any EVM-Lite application.

## Developement
An abstract implementation of the `Keystore` module is exposed by `AbstractKeystore`. Using this class you can create your own keystore management module.

As an example please refer to `src/Keystore.ts`.

### Methods

#### constructor

```typescript
constructor(path: string)
```

##### Example
```typescript
const keystore = new Keystore('<HOME_DIR>/.evmlc/keystore')
```

#### list

Should list all `V3JSONKeystore` files in the directory specified in the constructor.

```typescript
list(): Promise<V3JSONKeyStore[]>
```

##### Example
```typescript
keystore
    .list()
    .then(console.log)
    .catch(console.log);
```

#### get

Should get a single `V3JSONKeystore` file.

```typescript
get(address: string): Promise<V3JSONKeyStore>
```

##### Example

```typescript
keystore
    .get('0x15418f174df69d798b3872BEc30881eaF51d042F')
    .then(console.log)
    .catch(console.log);
```

#### create

Should create a `V3JSONKeystore` encrypted with the password specified and place in the directory.

```typescript
create(password: string): Promise<V3JSONKeyStore>
```

##### Example
```typescript
keystore
    .create('supersecurepassword')
    .then(console.log)
    .catch(console.log);
```
<!-- 
- `create()` - create a single `V3JSONKeystore` file
- `update()` - update the password on a single `V3JSONKeystore` file
- `import()` - import a single `V3JSONKeystore` file
- `export()` - export a single `V3JSONKeystore` file -->

