EVM-Lite Utils
==============

This package provides useful utility functions which help use other
libraries.

Currency
--------

One of the more important classes this package exports is the
``Currency`` class. This will help you convert and do any arithmetic
with the underlying currency of an ``evm-lite`` node.

The constructor for this class either takes a ``BigNumber`` or a string
representing the number of tokens and the denomination.

The denominations of a Token are:

.. code:: console

   1 / 1 000 000 000 000 000 000           atto        (a) 10^-18
   1 / 1 000 000 000 000 000               femto       (f) 10^-15
   1 / 1 000 000 000 000                   pico        (p) 10^-12
   1 / 1 000 000 000                       nano        (n) 10^-9
   1 / 1 000 000                           micro       (u) 10^-6
   1 / 1 000                               milli       (m) 10^-3
   1                                       Token       (T) 1

Example (Transfer)
~~~~~~~~~~~~~~~~~~

We want to transfer from ``0xd352d81c10266ead1a0ef87db12e9ce6ba68abf5``
to ``0x69c68dd72d71f784682c05776b0fb6f739549395`` a value of ``500T``
(500 Tokens).

We would first make sure we have a running node. Then send the transfer
using the abstraction provided by the ``Node`` object.

.. code:: javascript

   // Import node object
   const Node = require('evm-lite-core').default;
   const { Account } = require('evm-lite-core');

   // Import currency modules
   const { Currency } = require('evm-lite-utils');

   // Generate account from privatekey for address `0xd352d81c10266ead1a0ef87db12e9ce6ba68abf5`
   const account = Account.fromPrivateKey('PRIVATE_KEY');

   // Create node object
   const node = new Node('HOST', 8080);

   node.transfer(
       account,
       '0x69c68dd72d71f784682c05776b0fb6f739549395',
       // You can do this with any other denomination
       Currency.Token.times(500),
       10000000,
       0
   )
       .then(console.log)
       .catch(console.log);

Example (Conversion)
~~~~~~~~~~~~~~~~~~~~

We can also convert from one denomination to another very easily using
the ``Currency.format`` method. Say we wanted to convert ``300m * 200n`` (300
milli * 200 nano) tokens to ``T``.

.. code:: javascript

   const am1 = new Currency('300m');
   const am2 = new Currency('200n');

   // this can be done for any denomination
   console.log(am1.times(am2).format('T'));
