# EVM-Lite Core

This is the core module to interact with an EVM-Lite or Monet node. It exposes classes which help interact with contracts, accounts, transactions and the node itself.

There are three main objects exposed as part of this library:

-   `Node`
-   `Contract`
-   `Account`
-   `Transaction`

_Only the `Node` class has the functionality to send requests to the node._

## Node

A node is essentially a wrapper around a client to access EVM-Lite specific endpoints as well as the underlying consensus.

### Constructor

The constructor for a node object takes the following values:

```typescript
constructor(host: string, port: number = 8080, consensus: TConsensus)
```

Where `TConsensus` is any class which extends the `IAbstractConsensus` class exposed by `evm-lite-consensus`.

More formally:

```typescript
class Node<TConsensus extends IAbstractConsensus>
```

#### Example (ES5)

```javascript
const { default: Node } = require('evm-lite-core');
const { Babble } = require('evm-lite-consensus');

const babble = new Babble('127.0.0.1', 8080);
const node = new Node('127.0.0.1', 8080, babble);
```

### Methods

-   `sendTx` - submits a transaction that mutates state to the node

    **Definition (TS)**

    ```typescript
    sendTx(tx: Transaction, account: Account): Promise<IReceipt>
    ```

-   `transfer` (_wrapper around `sendTx`_) - transfers the specified number of tokens to another address

    **Definition (TS)**

    ```typescript
    transfer(from: Account, to: string, value: number, gas: number, gasPrice: number): Promise<IReceipt>
    ```

    **Example (ES5)**

    ```javascript
    const { Account } = require('evm-lite-core');

    // Create account object from private key
    const account = Account.fromPrivateKey('PRIVATE_KEY');

    // First parameter if of type `Account`
    node.transfer(account, 'TO_ADDRESS', 1000, 100000000, 0)
    	.then(receipt => console.log(receipt))
    	.catch(console.log);
    ```

-   `callTx` - submits a transaction that does **not** mutate state to the node

    **Definition (TS)**

    ```typescript
    callTx<R>(tx: Transaction): Promise<R>
    ```

-   `getAccount` - fetches account balance, nonce, and bytecode for a specified address

    **Definition (TS)**

    ```typescript
    getAccount(address: string): Promise<IBaseAccount>
    ```

    **Example (ES5)**

    ```javascript
    node.getAccount('0x9f640e0930370ff42c9b0c7679f83d4c7f3f98cd')
    	.then(account => console.log(account))
    	.catch(console.log);
    ```
