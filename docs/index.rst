Overview
===========

EVM-Lite JS provides serveral modules to interact with an
`EVM-Lite <https://github.com/mosaicnetworks/evm-lite>`__ or
`Monet <https://github.com/mosaicnetworks/monetd>`__ nodes.

The current list of modules:

-  ``evm-lite-core`` - Core module to interact with an EVM-Lite
   node
-  ``evm-lite-keystore`` - Keystore management for applications
-  ``evm-lite-datadir`` - Data directory management for
   applications
-  ``evm-lite-utils`` - An aggregate of utility functions used by
   EVM-Lite JS modules
-  ``evm-lite-consensus`` - Our consensus clients as well as an
   ``IAbstractConsensus`` class
-  ``evm-lite-client`` - A simple HTTP client for EVM-Lite

The following documentation will guide you through installing and
running EVM-Lite JS, as well as providing API documentation with
examples.

*Will also include type definitions for parameters and returns.*

------------------------------------------------------------------------------------------



.. toctree::
   :maxdepth: 2

   getting-started
   client.rst
   consensus.rst

   core.rst

   keystore.rst
   datadir.rst
   utils.rst

   developers
