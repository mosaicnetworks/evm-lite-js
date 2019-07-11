> **[EVM-Lite Core](../README.md)**

[Globals](../globals.md) / [Formatters](formatters.md) /

# Class: Formatters

## Hierarchy

* **Formatters**

### Index

#### Methods

* [inputAddressFormatter](formatters.md#static-inputaddressformatter)
* [inputCallFormatter](formatters.md#static-inputcallformatter)
* [txInputFormatter](formatters.md#static-txinputformatter)

## Methods

### `Static` inputAddressFormatter

▸ **inputAddressFormatter**(`address`: string): *string*

*Defined in [misc/formatters.ts:58](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/misc/formatters.ts#L58)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *string*

___

### `Static` inputCallFormatter

▸ **inputCallFormatter**(`txObject`: [TX](../interfaces/tx.md)): *[FormattedTransaction](../interfaces/formattedtransaction.md)*

*Defined in [misc/formatters.ts:19](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/misc/formatters.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`txObject` | [TX](../interfaces/tx.md) |

**Returns:** *[FormattedTransaction](../interfaces/formattedtransaction.md)*

___

### `Static` txInputFormatter

▸ **txInputFormatter**(`txObject`: [TX](../interfaces/tx.md)): *[FormattedTransaction](../interfaces/formattedtransaction.md)*

*Defined in [misc/formatters.ts:29](https://github.com/mosaicnetworks/evm-lite-js/blob/0058f20/packages/core/src/misc/formatters.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`txObject` | [TX](../interfaces/tx.md) |

**Returns:** *[FormattedTransaction](../interfaces/formattedtransaction.md)*