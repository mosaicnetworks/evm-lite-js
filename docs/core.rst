EVM-Lite Core
=============

This is the core module to interact with an EVM-Lite or Monet node. It
exposes classes which help interact with contracts, accounts,
transactions and the node itself.

There are three main objects exposed as part of this library:

-  ``Node``
-  ``Contract``
-  ``Account``
-  ``Transaction``
-  ``Monet`` - Simple wrapper around `Node<Babble>`

Only the ``Node`` class has the functionality to send requests to the
node.



.. toctree::
   :hidden:
   :maxdepth: 2

   core-account.rst
   core-contract.rst
   core-node.rst
