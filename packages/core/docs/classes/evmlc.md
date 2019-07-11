> **[EVM-Lite Core](../README.md)**

[Globals](../globals.md) / [EVMLC](evmlc.md) /

# Class: EVMLC

## Hierarchy

* [AbstractClient](abstractclient.md)

  * **EVMLC**

### Index

#### Constructors

* [constructor](evmlc.md#constructor)

#### Properties

* [host](evmlc.md#host)
* [port](evmlc.md#port)

#### Methods

* [callTX](evmlc.md#protected-calltx)
* [callTransaction](evmlc.md#calltransaction)
* [getAccount](evmlc.md#getaccount)
* [getAccounts](evmlc.md#getaccounts)
* [getContract](evmlc.md#getcontract)
* [getInfo](evmlc.md#getinfo)
* [getPOAContract](evmlc.md#getpoacontract)
* [getReceipt](evmlc.md#getreceipt)
* [sendRaw](evmlc.md#protected-sendraw)
* [sendTX](evmlc.md#protected-sendtx)
* [sendTransaction](evmlc.md#sendtransaction)

## Constructors

###  constructor

\+ **new EVMLC**(`host`: string, `port`: number): *[EVMLC](evmlc.md)*

*Overrides [AbstractClient](abstractclient.md).[constructor](abstractclient.md#protected-constructor)*

*Defined in [core/src/EVMLC.ts:15](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/EVMLC.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`host` | string |
`port` | number |

**Returns:** *[EVMLC](evmlc.md)*

## Properties

###  host

• **host**: *string*

*Inherited from [AbstractClient](abstractclient.md).[host](abstractclient.md#host)*

*Defined in [core/src/client/AbstractClient.ts:68](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L68)*

___

###  port

• **port**: *number*

*Inherited from [AbstractClient](abstractclient.md).[port](abstractclient.md#port)*

*Defined in [core/src/client/AbstractClient.ts:69](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L69)*

## Methods

### `Protected` callTX

▸ **callTX**(`tx`: string): *`Promise<CallTransactionResponse>`*

*Inherited from [AbstractClient](abstractclient.md).[callTX](abstractclient.md#protected-calltx)*

*Defined in [core/src/client/AbstractClient.ts:112](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L112)*

**Parameters:**

Name | Type |
------ | ------ |
`tx` | string |

**Returns:** *`Promise<CallTransactionResponse>`*

___

###  callTransaction

▸ **callTransaction**<**R**>(`transaction`: [Transaction](transaction.md)): *`Promise<R>`*

*Defined in [core/src/EVMLC.ts:136](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/EVMLC.ts#L136)*

Sends a pure/view transaction to the node and returns the return of the
contract function.

**`remarks`** 
The returned object will be parsed to JS types.

**`alpha`** 

**Type parameters:**

▪ **R**

**Parameters:**

Name | Type |
------ | ------ |
`transaction` | [Transaction](transaction.md) |

**Returns:** *`Promise<R>`*

A promise resolving the return of the contract function

___

###  getAccount

▸ **getAccount**(`address`: string): *`Promise<BaseAccount>`*

*Inherited from [AbstractClient](abstractclient.md).[getAccount](abstractclient.md#getaccount)*

*Defined in [core/src/client/AbstractClient.ts:90](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L90)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *`Promise<BaseAccount>`*

___

###  getAccounts

▸ **getAccounts**(): *`Promise<BaseAccount[]>`*

*Inherited from [AbstractClient](abstractclient.md).[getAccounts](abstractclient.md#getaccounts)*

*Defined in [core/src/client/AbstractClient.ts:97](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L97)*

**Returns:** *`Promise<BaseAccount[]>`*

___

###  getContract

▸ **getContract**(): *`Promise<Contracts>`*

*Inherited from [AbstractClient](abstractclient.md).[getContract](abstractclient.md#getcontract)*

*Defined in [core/src/client/AbstractClient.ts:78](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L78)*

**Returns:** *`Promise<Contracts>`*

___

###  getInfo

▸ **getInfo**(): *`Promise<Readonly<object>>`*

*Inherited from [AbstractClient](abstractclient.md).[getInfo](abstractclient.md#getinfo)*

*Defined in [core/src/client/AbstractClient.ts:106](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L106)*

**Returns:** *`Promise<Readonly<object>>`*

___

###  getPOAContract

▸ **getPOAContract**(): *`Promise<POAContract>`*

*Inherited from [AbstractClient](abstractclient.md).[getPOAContract](abstractclient.md#getpoacontract)*

*Defined in [core/src/client/AbstractClient.ts:72](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L72)*

**Returns:** *`Promise<POAContract>`*

___

###  getReceipt

▸ **getReceipt**(`txHash`: string): *`Promise<TransactionReceipt>`*

*Inherited from [AbstractClient](abstractclient.md).[getReceipt](abstractclient.md#getreceipt)*

*Defined in [core/src/client/AbstractClient.ts:84](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L84)*

**Parameters:**

Name | Type |
------ | ------ |
`txHash` | string |

**Returns:** *`Promise<TransactionReceipt>`*

___

### `Protected` sendRaw

▸ **sendRaw**(`tx`: string): *`Promise<TransactionResponse>`*

*Inherited from [AbstractClient](abstractclient.md).[sendRaw](abstractclient.md#protected-sendraw)*

*Defined in [core/src/client/AbstractClient.ts:122](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L122)*

**Parameters:**

Name | Type |
------ | ------ |
`tx` | string |

**Returns:** *`Promise<TransactionResponse>`*

___

### `Protected` sendTX

▸ **sendTX**(`tx`: string): *`Promise<TransactionResponse>`*

*Inherited from [AbstractClient](abstractclient.md).[sendTX](abstractclient.md#protected-sendtx)*

*Defined in [core/src/client/AbstractClient.ts:116](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L116)*

**Parameters:**

Name | Type |
------ | ------ |
`tx` | string |

**Returns:** *`Promise<TransactionResponse>`*

___

###  sendTransaction

▸ **sendTransaction**(`tx`: [Transaction](transaction.md), `account`: [Account](account.md)): *`Promise<TransactionReceipt>`*

*Defined in [core/src/EVMLC.ts:34](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/EVMLC.ts#L34)*

Sends a payable transaction to the node and returns the transaction
receipt of the transaction.

**`remarks`** 
The returned receipt will have its `logs` parsed if any automatically
with the corresponding decoders.

**`alpha`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tx` | [Transaction](transaction.md) | The transaction to be sent |
`account` | [Account](account.md) | The account used to sign the transaction |

**Returns:** *`Promise<TransactionReceipt>`*

A promise resolving a transaction receipt