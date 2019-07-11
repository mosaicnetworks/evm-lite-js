> **[EVM-Lite Core](../README.md)**

[Globals](../globals.md) / [Account](account.md) /

# Class: Account

## Hierarchy

* **Account**

### Index

#### Constructors

* [constructor](account.md#constructor)

#### Properties

* [address](account.md#address)
* [balance](account.md#balance)
* [nonce](account.md#nonce)
* [privateKey](account.md#privatekey)

#### Methods

* [signTransaction](account.md#signtransaction)
* [toBaseAccount](account.md#tobaseaccount)
* [create](account.md#static-create)
* [fromPrivateKey](account.md#static-fromprivatekey)
* [prepareTransfer](account.md#static-preparetransfer)

## Constructors

###  constructor

\+ **new Account**(`__namedParameters`: object): *[Account](account.md)*

*Defined in [core/src/Account.ts:109](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Account.ts#L109)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`address` | string |
`privateKey` | string |

**Returns:** *[Account](account.md)*

## Properties

###  address

• **address**: *`EVMTypes.Address`*

*Defined in [core/src/Account.ts:105](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Account.ts#L105)*

___

###  balance

• **balance**: *number* = 0

*Defined in [core/src/Account.ts:108](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Account.ts#L108)*

___

###  nonce

• **nonce**: *number* = 0

*Defined in [core/src/Account.ts:109](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Account.ts#L109)*

___

###  privateKey

• **privateKey**: *string*

*Defined in [core/src/Account.ts:106](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Account.ts#L106)*

## Methods

###  signTransaction

▸ **signTransaction**(`tx`: [TX](../interfaces/tx.md)): *[SignedTransaction](../interfaces/signedtransaction.md)*

*Defined in [core/src/Account.ts:129](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Account.ts#L129)*

Signs a transaction

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tx` | [TX](../interfaces/tx.md) | The transaction to sign  |

**Returns:** *[SignedTransaction](../interfaces/signedtransaction.md)*

The signed object

___

###  toBaseAccount

▸ **toBaseAccount**(): *[BaseAccount](../interfaces/baseaccount.md)*

*Defined in [core/src/Account.ts:210](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Account.ts#L210)*

Converts `this` object to a compact overview of the account.

**Returns:** *[BaseAccount](../interfaces/baseaccount.md)*

A compact representation of the `Account` object

___

### `Static` create

▸ **create**(`entropy?`: undefined | string): *[Account](account.md)*

*Defined in [core/src/Account.ts:52](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Account.ts#L52)*

Creates an account key pair.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`entropy?` | undefined \| string | A random seed used to generate the account  |

**Returns:** *[Account](account.md)*

A newly created `Account` object

___

### `Static` fromPrivateKey

▸ **fromPrivateKey**(`privateKey`: string): *[Account](account.md)*

*Defined in [core/src/Account.ts:39](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Account.ts#L39)*

Creates an `Account` object for the given private key hex.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKey` | string | The private key hex  |

**Returns:** *[Account](account.md)*

The account object representing the private key

___

### `Static` prepareTransfer

▸ **prepareTransfer**(`from`: `EVMTypes.Address`, `to`: `EVMTypes.Address`, `value`: `EVMTypes.Value`, `gas`: `EVMTypes.Gas`, `gasPrice`: `EVMTypes.GasPrice`): *[Transaction](transaction.md)*

*Defined in [core/src/Account.ts:70](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Account.ts#L70)*

Generates a transaction to transfer funds from one address to
another.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`from` | `EVMTypes.Address` | The address to deduct `value` tokens from |
`to` | `EVMTypes.Address` | The address to transfer `value` tokens to |
`value` | `EVMTypes.Value` | The number of tokens to transfer |
`gas` | `EVMTypes.Gas` | The max `gas` limit |
`gasPrice` | `EVMTypes.GasPrice` | The `gasPrice` per unit of `gas`  |

**Returns:** *[Transaction](transaction.md)*

A transaction object represeting the requested transfer