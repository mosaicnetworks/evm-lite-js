> **[EVM-Lite Core](../README.md)**

[Globals](../globals.md) / [Utils](utils.md) /

# Class: Utils

## Hierarchy

* **Utils**

### Index

#### Constructors

* [constructor](utils.md#private-constructor)

#### Methods

* [cleanAddress](utils.md#static-cleanaddress)
* [createDirectoryIfNotExists](utils.md#static-createdirectoryifnotexists)
* [deepEquals](utils.md#static-deepequals)
* [exists](utils.md#static-exists)
* [isDirectory](utils.md#static-isdirectory)
* [isEquivalentObjects](utils.md#static-isequivalentobjects)
* [trimHex](utils.md#static-trimhex)

## Constructors

### `Private` constructor

\+ **new Utils**(): *[Utils](utils.md)*

*Defined in [utils/src/index.ts:4](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/utils/src/index.ts#L4)*

**Returns:** *[Utils](utils.md)*

## Methods

### `Static` cleanAddress

▸ **cleanAddress**(`address`: string): *string*

*Defined in [utils/src/index.ts:9](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/utils/src/index.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *string*

___

### `Static` createDirectoryIfNotExists

▸ **createDirectoryIfNotExists**(`path`: string): *void*

*Defined in [utils/src/index.ts:62](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/utils/src/index.ts#L62)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *void*

___

### `Static` deepEquals

▸ **deepEquals**(`objectA`: any, `objectB`: any): *boolean*

*Defined in [utils/src/index.ts:68](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/utils/src/index.ts#L68)*

**Parameters:**

Name | Type |
------ | ------ |
`objectA` | any |
`objectB` | any |

**Returns:** *boolean*

___

### `Static` exists

▸ **exists**(`path`: string): *boolean*

*Defined in [utils/src/index.ts:54](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/utils/src/index.ts#L54)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *boolean*

___

### `Static` isDirectory

▸ **isDirectory**(`path`: string): *boolean*

*Defined in [utils/src/index.ts:58](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/utils/src/index.ts#L58)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *boolean*

___

### `Static` isEquivalentObjects

▸ **isEquivalentObjects**(`objectA`: any, `objectB`: any): *boolean*

*Defined in [utils/src/index.ts:15](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/utils/src/index.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`objectA` | any |
`objectB` | any |

**Returns:** *boolean*

___

### `Static` trimHex

▸ **trimHex**(`hex`: string): *string*

*Defined in [utils/src/index.ts:44](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/utils/src/index.ts#L44)*

**Parameters:**

Name | Type |
------ | ------ |
`hex` | string |

**Returns:** *string*