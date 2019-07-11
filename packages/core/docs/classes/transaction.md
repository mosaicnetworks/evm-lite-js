> **[EVM-Lite Core](../README.md)**

[Globals](../globals.md) / [Transaction](transaction.md) /

# Class: Transaction

## Hierarchy

* **Transaction**

## Implements

* [TX](../interfaces/tx.md)

### Index

#### Constructors

* [constructor](transaction.md#constructor)

#### Properties

* [chainId](transaction.md#optional-chainid)
* [constant](transaction.md#constant)
* [data](transaction.md#optional-data)
* [from](transaction.md#optional-from)
* [gas](transaction.md#gas)
* [gasPrice](transaction.md#gasprice)
* [hash](transaction.md#optional-hash)
* [nonce](transaction.md#optional-nonce)
* [parseLogs](transaction.md#private-optional-parselogs)
* [receipt](transaction.md#optional-receipt)
* [signed](transaction.md#optional-signed)
* [to](transaction.md#optional-to)
* [unpackfn](transaction.md#optional-unpackfn)
* [value](transaction.md#optional-value)

#### Methods

* [afterSubmission](transaction.md#aftersubmission)
* [beforeSubmission](transaction.md#beforesubmission)
* [clean](transaction.md#private-clean)
* [parseReceipt](transaction.md#private-parsereceipt)

## Constructors

###  constructor

\+ **new Transaction**(`tx`: [TX](../interfaces/tx.md), `constant`: boolean, `parseLogs?`: undefined | function, `unpackfn?`: any): *[Transaction](transaction.md)*

*Defined in [Transaction.ts:42](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/Transaction.ts#L42)*

**Parameters:**

Name | Type |
------ | ------ |
`tx` | [TX](../interfaces/tx.md) |
`constant` | boolean |
`parseLogs?` | undefined \| function |
`unpackfn?` | any |

**Returns:** *[Transaction](transaction.md)*

## Properties

### `Optional` chainId

• **chainId**? : *undefined | number*

*Implementation of [TX](../interfaces/tx.md).[chainId](../interfaces/tx.md#optional-chainid)*

*Defined in [Transaction.ts:38](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/Transaction.ts#L38)*

___

###  constant

• **constant**: *boolean*

*Defined in [Transaction.ts:46](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/Transaction.ts#L46)*

___

### `Optional` data

• **data**? : *undefined | string*

*Implementation of [TX](../interfaces/tx.md).[data](../interfaces/tx.md#optional-data)*

*Defined in [Transaction.ts:34](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/Transaction.ts#L34)*

___

### `Optional` from

• **from**? : *undefined | string*

*Implementation of [TX](../interfaces/tx.md).[from](../interfaces/tx.md#optional-from)*

*Defined in [Transaction.ts:31](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/Transaction.ts#L31)*

___

###  gas

• **gas**: *number*

*Implementation of [TX](../interfaces/tx.md).[gas](../interfaces/tx.md#gas)*

*Defined in [Transaction.ts:35](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/Transaction.ts#L35)*

___

###  gasPrice

• **gasPrice**: *number*

*Implementation of [TX](../interfaces/tx.md).[gasPrice](../interfaces/tx.md#gasprice)*

*Defined in [Transaction.ts:36](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/Transaction.ts#L36)*

___

### `Optional` hash

• **hash**? : *undefined | string*

*Defined in [Transaction.ts:40](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/Transaction.ts#L40)*

___

### `Optional` nonce

• **nonce**? : *undefined | number*

*Implementation of [TX](../interfaces/tx.md).[nonce](../interfaces/tx.md#optional-nonce)*

*Defined in [Transaction.ts:37](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/Transaction.ts#L37)*

___

### `Private` `Optional` parseLogs

• **parseLogs**? : *undefined | function*

*Defined in [Transaction.ts:47](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/Transaction.ts#L47)*

___

### `Optional` receipt

• **receipt**? : *[TransactionReceipt](../interfaces/transactionreceipt.md)*

*Defined in [Transaction.ts:42](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/Transaction.ts#L42)*

___

### `Optional` signed

• **signed**? : *[SignedTransaction](../interfaces/signedtransaction.md)*

*Defined in [Transaction.ts:41](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/Transaction.ts#L41)*

___

### `Optional` to

• **to**? : *undefined | string*

*Implementation of [TX](../interfaces/tx.md).[to](../interfaces/tx.md#optional-to)*

*Defined in [Transaction.ts:32](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/Transaction.ts#L32)*

___

### `Optional` unpackfn

• **unpackfn**? : *any*

*Defined in [Transaction.ts:48](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/Transaction.ts#L48)*

___

### `Optional` value

• **value**? : *undefined | number*

*Implementation of [TX](../interfaces/tx.md).[value](../interfaces/tx.md#optional-value)*

*Defined in [Transaction.ts:33](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/Transaction.ts#L33)*

## Methods

###  afterSubmission

▸ **afterSubmission**(): *void*

*Defined in [Transaction.ts:71](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/Transaction.ts#L71)*

**Returns:** *void*

___

###  beforeSubmission

▸ **beforeSubmission**(): *void*

*Defined in [Transaction.ts:67](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/Transaction.ts#L67)*

**Returns:** *void*

___

### `Private` clean

▸ **clean**(): *void*

*Defined in [Transaction.ts:86](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/Transaction.ts#L86)*

**Returns:** *void*

___

### `Private` parseReceipt

▸ **parseReceipt**(): *void*

*Defined in [Transaction.ts:75](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/Transaction.ts#L75)*

**Returns:** *void*