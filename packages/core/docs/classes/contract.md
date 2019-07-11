> **[EVM-Lite Core](../README.md)**

[Globals](../globals.md) / [Contract](contract.md) /

# Class: Contract <**Schema**>

## Type parameters

▪ **Schema**: *[AbstractSchema](../interfaces/abstractschema.md)*

## Hierarchy

* **Contract**

### Index

#### Constructors

* [constructor](contract.md#constructor)

#### Properties

* [abi](contract.md#abi)
* [address](contract.md#optional-address)
* [bytcode](contract.md#optional-bytcode)
* [methods](contract.md#methods)

#### Methods

* [attachMethodsToContract](contract.md#private-attachmethodstocontract)
* [deployTransaction](contract.md#deploytransaction)
* [encodeConstructorParams](contract.md#private-encodeconstructorparams)
* [parseLogs](contract.md#private-parselogs)
* [setAddressAndAddFunctions](contract.md#setaddressandaddfunctions)
* [create](contract.md#static-create)
* [load](contract.md#static-load)

## Constructors

###  constructor

\+ **new Contract**(`abi`: [ContractABI](../globals.md#contractabi), `address?`: `EVMTypes.Address`, `bytcode?`: undefined | string): *[Contract](contract.md)*

*Defined in [core/src/Contract.ts:68](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Contract.ts#L68)*

**Parameters:**

Name | Type |
------ | ------ |
`abi` | [ContractABI](../globals.md#contractabi) |
`address?` | `EVMTypes.Address` |
`bytcode?` | undefined \| string |

**Returns:** *[Contract](contract.md)*

## Properties

###  abi

• **abi**: *[ContractABI](../globals.md#contractabi)*

*Defined in [core/src/Contract.ts:71](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Contract.ts#L71)*

___

### `Optional` address

• **address**? : *`EVMTypes.Address`*

*Defined in [core/src/Contract.ts:72](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Contract.ts#L72)*

___

### `Optional` bytcode

• **bytcode**? : *undefined | string*

*Defined in [core/src/Contract.ts:73](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Contract.ts#L73)*

___

###  methods

• **methods**: *`Schema`* =  {} as Schema

*Defined in [core/src/Contract.ts:68](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Contract.ts#L68)*

## Methods

### `Private` attachMethodsToContract

▸ **attachMethodsToContract**(): *void*

*Defined in [core/src/Contract.ts:136](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Contract.ts#L136)*

**Returns:** *void*

___

###  deployTransaction

▸ **deployTransaction**(`parameters`: any[], `from`: `EVMTypes.Address`, `gas`: `EVMTypes.Gas`, `gasPrice`: `EVMTypes.GasPrice`): *[Transaction](transaction.md)*

*Defined in [core/src/Contract.ts:91](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Contract.ts#L91)*

Generates a transaction that represets the deployment of a contract
to the network.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parameters` | any[] | The constructor parameters for contract |
`from` | `EVMTypes.Address` | The `from` address to deploy the contract with |
`gas` | `EVMTypes.Gas` | The max `gas` to use for deployment |
`gasPrice` | `EVMTypes.GasPrice` | The `gasPrice`for the transaction  |

**Returns:** *[Transaction](transaction.md)*

The transaction object represeting deployment

___

### `Private` encodeConstructorParams

▸ **encodeConstructorParams**(`params`: any[]): *any*

*Defined in [core/src/Contract.ts:168](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Contract.ts#L168)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | any[] |

**Returns:** *any*

___

### `Private` parseLogs

▸ **parseLogs**(`logs`: [Log](../interfaces/log.md)[]): *[Log](../interfaces/log.md)[]*

*Defined in [core/src/Contract.ts:181](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Contract.ts#L181)*

**Parameters:**

Name | Type |
------ | ------ |
`logs` | [Log](../interfaces/log.md)[] |

**Returns:** *[Log](../interfaces/log.md)[]*

___

###  setAddressAndAddFunctions

▸ **setAddressAndAddFunctions**(`address`: string): *this*

*Defined in [core/src/Contract.ts:129](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Contract.ts#L129)*

Sets the contract address to be used to any transactions
generated from this object and populates the contract methods
under `.methods`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | string | The address of the contract  |

**Returns:** *this*

___

### `Static` create

▸ **create**<**S**>(`abi`: [ContractABI](../globals.md#contractabi), `bytcode`: string): *[Contract](contract.md)‹*`S`*›*

*Defined in [core/src/Contract.ts:61](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Contract.ts#L61)*

Create a `Contract` object for a contract that is yet to be
deployed to a network.

**Type parameters:**

▪ **S**: *[AbstractSchema](../interfaces/abstractschema.md)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`abi` | [ContractABI](../globals.md#contractabi) | The application binary interface of the contract |
`bytcode` | string | - |

**Returns:** *[Contract](contract.md)‹*`S`*›*

A contract abstraction object to be used for interacting with
the contract

___

### `Static` load

▸ **load**<**S**>(`abi`: [ContractABI](../globals.md#contractabi), `address`: `EVMTypes.Address`): *[Contract](contract.md)‹*`S`*›*

*Defined in [core/src/Contract.ts:44](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Contract.ts#L44)*

Create a `Contract` object for a contract that has already
been deployed to the network.

**Type parameters:**

▪ **S**: *[AbstractSchema](../interfaces/abstractschema.md)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`abi` | [ContractABI](../globals.md#contractabi) | The application binary interface of the contract |
`address` | `EVMTypes.Address` | The address of the contract  |

**Returns:** *[Contract](contract.md)‹*`S`*›*

A contract abstraction object to be used for interacting with
the contract