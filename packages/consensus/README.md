# EVM-Lite Consensus

The consensus client implementations for EVM-Lite.

## Solo

An empty class is exported for convenienve when using EVM-Lite in `solo` mode.

## Babble

The `Babble` class exposes methods to interact with its API.

-   `getBlock(index: number)` - returns a babble block by index
-   `getPeers()` - returns the current list of peers
-   `getGenesisPeers()` - returns the genesis peers

## Development

An `AbstractConsensus` class is exposed by this module to allow for other consensus algorithms to be used along side any of `evm-lite-js` modules.
