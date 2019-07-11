> **[EVM-Lite Core](README.md)**

[Globals](globals.md) /

# EVM-Lite Core

### Index

#### Modules

* [EVM](modules/evm.md)

#### Classes

* [AbstractClient](classes/abstractclient.md)
* [Account](classes/account.md)
* [Contract](classes/contract.md)
* [EVMLC](classes/evmlc.md)
* [Formatters](classes/formatters.md)
* [Function](classes/function.md)
* [Transaction](classes/transaction.md)
* [Utils](classes/utils.md)

#### Interfaces

* [ABI](interfaces/abi.md)
* [AbstractSchema](interfaces/abstractschema.md)
* [BaseAccount](interfaces/baseaccount.md)
* [BaseTransaction](interfaces/basetransaction.md)
* [CallTransactionResponse](interfaces/calltransactionresponse.md)
* [FormattedTransaction](interfaces/formattedtransaction.md)
* [Input](interfaces/input.md)
* [Log](interfaces/log.md)
* [POAContract](interfaces/poacontract.md)
* [RequestOptions](interfaces/requestoptions.md)
* [SignedTransaction](interfaces/signedtransaction.md)
* [TX](interfaces/tx.md)
* [TransactionReceipt](interfaces/transactionreceipt.md)
* [TransactionResponse](interfaces/transactionresponse.md)

#### Type aliases

* [ContractABI](globals.md#contractabi)
* [Contracts](globals.md#contracts)

#### Variables

* [SolFunction](globals.md#const-solfunction)

#### Functions

* [delay](globals.md#delay)
* [makeEven](globals.md#const-makeeven)
* [trimLeadingZero](globals.md#const-trimleadingzero)

## Type aliases

###  ContractABI

Ƭ **ContractABI**: *[ABI](interfaces/abi.md)[]*

*Defined in [core/src/Contract.ts:27](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Contract.ts#L27)*

___

###  Contracts

Ƭ **Contracts**: *object*

*Defined in [core/src/client/AbstractClient.ts:62](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/client/AbstractClient.ts#L62)*

#### Type declaration:

* **contracts**: *object[]*

## Variables

### `Const` SolFunction

• **SolFunction**: *any* =  require('web3/lib/web3/function')

*Defined in [core/src/contract/Function.ts:4](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/contract/Function.ts#L4)*

## Functions

###  delay

▸ **delay**(`t`: number, `v?`: any): *`Promise<Object>`*

*Defined in [core/src/EVMLC.ts:9](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/EVMLC.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`t` | number |
`v?` | any |

**Returns:** *`Promise<Object>`*

___

### `Const` makeEven

▸ **makeEven**(`hex`: string): *string*

*Defined in [core/src/Account.ts:23](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Account.ts#L23)*

**Parameters:**

Name | Type |
------ | ------ |
`hex` | string |

**Returns:** *string*

___

### `Const` trimLeadingZero

▸ **trimLeadingZero**(`hex`: string): *string*

*Defined in [core/src/Account.ts:15](https://github.com/mosaicnetworks/evm-lite-js/blob/578e9b5/packages/core/src/Account.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`hex` | string |

**Returns:** *string*