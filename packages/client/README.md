# EVM-Lite Client

A simple HTTP client for `EVM-Lite`.

## Methods

-   `getAccount(address: string)` - gets an account from the node
-   `getInfo()` - gets info about the node including consensus
-   `sendTx(tx: string)` - sends a signed transaction to the node
-   `callTx(tx: string)` - calls a transaction to the node
-   `getReceipt(hash: string)` - returns the receipt for a given `txHash`
