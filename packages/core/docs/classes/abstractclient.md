> **[EVM-Lite Core](../README.md)**

[Globals](../globals.md) / [AbstractClient](abstractclient.md) /

# Class: AbstractClient

## Hierarchy

* **AbstractClient**

  * [EVMLC](evmlc.md)

### Index

#### Constructors

* [constructor](abstractclient.md#protected-constructor)

#### Properties

* [host](abstractclient.md#host)
* [port](abstractclient.md#port)

#### Methods

* [callTX](abstractclient.md#protected-calltx)
* [get](abstractclient.md#private-get)
* [getAccount](abstractclient.md#getaccount)
* [getAccounts](abstractclient.md#getaccounts)
* [getContract](abstractclient.md#getcontract)
* [getInfo](abstractclient.md#getinfo)
* [getPOAContract](abstractclient.md#getpoacontract)
* [getReceipt](abstractclient.md#getreceipt)
* [options](abstractclient.md#private-options)
* [post](abstractclient.md#private-post)
* [request](abstractclient.md#private-request)
* [sendRaw](abstractclient.md#protected-sendraw)
* [sendTX](abstractclient.md#protected-sendtx)

## Constructors

### `Protected` constructor

\+ **new AbstractClient**(`host`: string, `port`: number): *[AbstractClient](abstractclient.md)*

*Defined in [core/src/client/AbstractClient.ts:66](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L66)*

**Parameters:**

Name | Type |
------ | ------ |
`host` | string |
`port` | number |

**Returns:** *[AbstractClient](abstractclient.md)*

## Properties

###  host

• **host**: *string*

*Defined in [core/src/client/AbstractClient.ts:68](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L68)*

___

###  port

• **port**: *number*

*Defined in [core/src/client/AbstractClient.ts:69](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L69)*

## Methods

### `Protected` callTX

▸ **callTX**(`tx`: string): *`Promise<CallTransactionResponse>`*

*Defined in [core/src/client/AbstractClient.ts:112](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L112)*

**Parameters:**

Name | Type |
------ | ------ |
`tx` | string |

**Returns:** *`Promise<CallTransactionResponse>`*

___

### `Private` get

▸ **get**(`path`: string): *`Promise<string>`*

*Defined in [core/src/client/AbstractClient.ts:128](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L128)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *`Promise<string>`*

___

###  getAccount

▸ **getAccount**(`address`: string): *`Promise<BaseAccount>`*

*Defined in [core/src/client/AbstractClient.ts:90](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L90)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *`Promise<BaseAccount>`*

___

###  getAccounts

▸ **getAccounts**(): *`Promise<BaseAccount[]>`*

*Defined in [core/src/client/AbstractClient.ts:97](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L97)*

**Returns:** *`Promise<BaseAccount[]>`*

___

###  getContract

▸ **getContract**(): *`Promise<Contracts>`*

*Defined in [core/src/client/AbstractClient.ts:78](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L78)*

**Returns:** *`Promise<Contracts>`*

___

###  getInfo

▸ **getInfo**(): *`Promise<Readonly<object>>`*

*Defined in [core/src/client/AbstractClient.ts:106](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L106)*

**Returns:** *`Promise<Readonly<object>>`*

___

###  getPOAContract

▸ **getPOAContract**(): *`Promise<POAContract>`*

*Defined in [core/src/client/AbstractClient.ts:72](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L72)*

**Returns:** *`Promise<POAContract>`*

___

###  getReceipt

▸ **getReceipt**(`txHash`: string): *`Promise<TransactionReceipt>`*

*Defined in [core/src/client/AbstractClient.ts:84](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L84)*

**Parameters:**

Name | Type |
------ | ------ |
`txHash` | string |

**Returns:** *`Promise<TransactionReceipt>`*

___

### `Private` options

▸ **options**(`method`: string, `path`: string): *[RequestOptions](../interfaces/requestoptions.md)*

*Defined in [core/src/client/AbstractClient.ts:136](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L136)*

**Parameters:**

Name | Type |
------ | ------ |
`method` | string |
`path` | string |

**Returns:** *[RequestOptions](../interfaces/requestoptions.md)*

___

### `Private` post

▸ **post**(`path`: string, `tx`: string): *`Promise<string>`*

*Defined in [core/src/client/AbstractClient.ts:132](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L132)*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |
`tx` | string |

**Returns:** *`Promise<string>`*

___

### `Private` request

▸ **request**(`options`: [RequestOptions](../interfaces/requestoptions.md), `tx?`: undefined | string): *`Promise<string>`*

*Defined in [core/src/client/AbstractClient.ts:145](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L145)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [RequestOptions](../interfaces/requestoptions.md) |
`tx?` | undefined \| string |

**Returns:** *`Promise<string>`*

___

### `Protected` sendRaw

▸ **sendRaw**(`tx`: string): *`Promise<TransactionResponse>`*

*Defined in [core/src/client/AbstractClient.ts:122](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L122)*

**Parameters:**

Name | Type |
------ | ------ |
`tx` | string |

**Returns:** *`Promise<TransactionResponse>`*

___

### `Protected` sendTX

▸ **sendTX**(`tx`: string): *`Promise<TransactionResponse>`*

*Defined in [core/src/client/AbstractClient.ts:116](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L116)*

**Parameters:**

Name | Type |
------ | ------ |
`tx` | string |

**Returns:** *`Promise<TransactionResponse>`*