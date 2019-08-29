Getting Started
===============

If you need to get any EVM-Lite JS modules into your project, you can do
so by running the following command depending on what package manager
you are using and which module you would like to install.

For ``evm-lite-core`` :

NPM:

.. code:: bash

   $ npm install evm-lite-core@1.0.0

Yarn:

.. code:: bash

   $ yarn add evm-lite-core@1.0.0

After that, you will need to create a ``Node`` instance and a consensus
client depending on what you are trying to connect to.

For a Monet node, we use `Babble <>`__ as our consensus algorithm hence
we would need a Babble client.

*Note: If you are using a custom node with a different consensus, you
will need to write your implementation for the client and it must extend
``IAbstractConsensus`` from ``evm-lite-consensus``*

.. code:: javascript

   // The default export of `evm-lite-core` is `Node`
   const { default: Node } = require('evm-lite-core');

   // We also need to the Babble class
   const { Babble } = require('evm-lite-consensus');

   // Create a babble client
   const babble = new Babble('127.0.0.1', 8080 /* default 8080 */);
   // Set consensus for node in the third parameter
   const node = new Node('127.0.0.1', 8080, babble);
