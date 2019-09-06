EVM-Lite Consensus
==================

The consensus client implementations for EVM-Lite.

Solo
----

An empty class is exported for convenience when using EVM-Lite in
``solo`` mode.

Babble
------

The ``Babble`` class exposes methods to interact with its API.

-  ``getBlock(index: number)`` - returns a babble block by index
-  ``getPeers()`` - returns the current list of peers
-  ``getGenesisPeers()`` - returns the genesis peers
-  ``getBlocks(start: number, count?: number)`` - returns a list of blocks starting at `start`. If no count is specified, will return a single block in an array.
-  ``getValidatorHistory()`` - returns entire history of the validator set
-  ``getValidators(round: number)`` - returns the validator set at a specific `round`