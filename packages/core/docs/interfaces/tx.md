> **[EVM-Lite Core](../README.md)**

[Globals](../globals.md) / [TX](tx.md) /

# Interface: TX

## Hierarchy

* [BaseTransaction](basetransaction.md)

  * **TX**

## Implemented by

* [Transaction](../classes/transaction.md)

### Index

#### Properties

* [chainId](tx.md#optional-chainid)
* [data](tx.md#optional-data)
* [from](tx.md#optional-from)
* [gas](tx.md#gas)
* [gasPrice](tx.md#gasprice)
* [nonce](tx.md#optional-nonce)
* [to](tx.md#optional-to)
* [value](tx.md#optional-value)

## Properties

### `Optional` chainId

• **chainId**? : *`EVMTypes.ChainID`*

*Inherited from [BaseTransaction](basetransaction.md).[chainId](basetransaction.md#optional-chainid)*

*Defined in [core/src/Transaction.ts:12](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Transaction.ts#L12)*

___

### `Optional` data

• **data**? : *`EVMTypes.Data`*

*Defined in [core/src/Transaction.ts:19](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Transaction.ts#L19)*

___

### `Optional` from

• **from**? : *`EVMTypes.Address`*

*Defined in [core/src/Transaction.ts:16](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Transaction.ts#L16)*

___

###  gas

• **gas**: *`EVMTypes.Gas`*

*Inherited from [BaseTransaction](basetransaction.md).[gas](basetransaction.md#gas)*

*Defined in [core/src/Transaction.ts:9](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Transaction.ts#L9)*

___

###  gasPrice

• **gasPrice**: *`EVMTypes.GasPrice`*

*Inherited from [BaseTransaction](basetransaction.md).[gasPrice](basetransaction.md#gasprice)*

*Defined in [core/src/Transaction.ts:10](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Transaction.ts#L10)*

___

### `Optional` nonce

• **nonce**? : *`EVMTypes.Nonce`*

*Inherited from [BaseTransaction](basetransaction.md).[nonce](basetransaction.md#optional-nonce)*

*Defined in [core/src/Transaction.ts:11](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Transaction.ts#L11)*

___

### `Optional` to

• **to**? : *`EVMTypes.Address`*

*Defined in [core/src/Transaction.ts:17](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Transaction.ts#L17)*

___

### `Optional` value

• **value**? : *`EVMTypes.Value`*

*Defined in [core/src/Transaction.ts:18](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Transaction.ts#L18)*