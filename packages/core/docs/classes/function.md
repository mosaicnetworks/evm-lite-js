> **[EVM-Lite Core](../README.md)**

[Globals](../globals.md) / [Function](function.md) /

# Class: Function

## Hierarchy

* **Function**

### Index

#### Constructors

* [constructor](function.md#constructor)

#### Properties

* [abi](function.md#private-abi)
* [constant](function.md#constant)
* [contractAddress](function.md#private-contractaddress)
* [inputTypes](function.md#inputtypes)
* [name](function.md#name)
* [outputTypes](function.md#outputtypes)
* [payable](function.md#payable)
* [solFunction](function.md#solfunction)

#### Methods

* [generateTransaction](function.md#generatetransaction)
* [unpackOutput](function.md#unpackoutput)

## Constructors

###  constructor

\+ **new Function**(`abi`: [ABI](../interfaces/abi.md), `contractAddress`: string): *[Function](function.md)*

*Defined in [core/src/contract/Function.ts:17](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/contract/Function.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`abi` | [ABI](../interfaces/abi.md) |
`contractAddress` | string |

**Returns:** *[Function](function.md)*

## Properties

### `Private` abi

• **abi**: *[ABI](../interfaces/abi.md)*

*Defined in [core/src/contract/Function.ts:20](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/contract/Function.ts#L20)*

___

###  constant

• **constant**: *boolean*

*Defined in [core/src/contract/Function.ts:16](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/contract/Function.ts#L16)*

___

### `Private` contractAddress

• **contractAddress**: *string*

*Defined in [core/src/contract/Function.ts:21](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/contract/Function.ts#L21)*

___

###  inputTypes

• **inputTypes**: *any[]*

*Defined in [core/src/contract/Function.ts:13](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/contract/Function.ts#L13)*

___

###  name

• **name**: *string*

*Defined in [core/src/contract/Function.ts:12](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/contract/Function.ts#L12)*

___

###  outputTypes

• **outputTypes**: *any[]*

*Defined in [core/src/contract/Function.ts:14](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/contract/Function.ts#L14)*

___

###  payable

• **payable**: *boolean*

*Defined in [core/src/contract/Function.ts:17](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/contract/Function.ts#L17)*

___

###  solFunction

• **solFunction**: *any*

*Defined in [core/src/contract/Function.ts:15](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/contract/Function.ts#L15)*

## Methods

###  generateTransaction

▸ **generateTransaction**(`parseLogs`: function, `options`: [TX](../interfaces/tx.md), ...`funcArgs`: any[]): *[Transaction](transaction.md)*

*Defined in [core/src/contract/Function.ts:52](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/contract/Function.ts#L52)*

**Parameters:**

▪ **parseLogs**: *function*

▸ (`logs`: [Log](../interfaces/log.md)[]): *[Log](../interfaces/log.md)[]*

**Parameters:**

Name | Type |
------ | ------ |
`logs` | [Log](../interfaces/log.md)[] |

▪ **options**: *[TX](../interfaces/tx.md)*

▪... **funcArgs**: *any[]*

**Returns:** *[Transaction](transaction.md)*

___

###  unpackOutput

▸ **unpackOutput**(`output`: string): *any*

*Defined in [core/src/contract/Function.ts:42](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/contract/Function.ts#L42)*

**Parameters:**

Name | Type |
------ | ------ |
`output` | string |

**Returns:** *any*