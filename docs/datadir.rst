EVM-Lite Datadir
================

A data directory for a client-sided EVM-Lite application takes the
following structure:

**Example:** MonetCLI (``~/Library/MONET``)

.. code:: console

   .
   ├── keystore
   │   ├── node0.json
   │   ├── node1.json
   │
   ├── monetcli.toml

The keystore is where all keyfiles will be stored and ``monetcli.toml``
is the configuration file where defaults for connection details and
transaction attributes are stored.

This module one default class ``DataDirectory`` which allows you to
interact with the directory structure explained above.

DataDirectory
-------------

Constructor
~~~~~~~~~~~

The constructor for a ``DataDirectory`` object takes the following
values:

.. code:: typescript

   constructor(public readonly path: string, configName: string, private readonly keystore: K)

Where ``K`` is any class which extends the ``AbstractKeystore`` class
exposed by ``evm-lite-keystore``.

More formally:

.. code:: typescript

   class DataDirectory<K extends AbstractKeystore>

Example (ES5)
^^^^^^^^^^^^^

.. code:: javascript

   const { default: DataDirectory } = require('evm-lite-core');
   const { default: Keystore } = require('evm-lite-keystore');

   const keystore = new Keystore('path/to/keystore');
   const datadir = new DataDirectory('path/to/directory', 'CONFIG_NAME', keystore);

``readConfig``
~~~~~~~~~~~~~~

Reads the configuration file with the name provided in the constructor
for the ``DataDirectory`` object.

Definition (TS)
^^^^^^^^^^^^^^^

.. code:: typescript

   readConfig(): Promise<IConfiguration>

``saveConfig``
~~~~~~~~~~~~~~

Saves a new configuration to the file.

.. _definition-ts-1:

Definition (TS)
^^^^^^^^^^^^^^^

.. code:: typescript

   saveConfig(schema: IConfiguration): Promise<void>

``newKeyfile``
~~~~~~~~~~~~~~

Creates a new keyfile with the specified passphrase and places it in the
data directories keystore folder.

.. _definition-ts-2:

Definition (TS)
^^^^^^^^^^^^^^^

.. code:: typescript

   newKeyfile(moniker: string, passphrase: string, path?: string): Promise<IV3Keyfile>

``getKeyfile``
~~~~~~~~~~~~~~

Fetches a keyfile by moniker from the respective keystore directory.

.. _definition-ts-3:

Definition (TS)
^^^^^^^^^^^^^^^

.. code:: typescript

   getKeyfile(moniker: string): Promise<IV3Keyfile>

``listKeyfiles``
~~~~~~~~~~~~~~~~

Returns an object with the key as ``moniker`` and the value as the JSON
keyfile.

.. _definition-ts-4:

Definition (TS)
^^^^^^^^^^^^^^^

.. code:: typescript

   listKeyfiles(): Promise<IMonikerKeystore>

``updateKeyfile``
~~~~~~~~~~~~~~~~~

Updates the passphrase for a keyfile if the old passphrase is known.

.. _definition-ts-5:

Definition (TS)
^^^^^^^^^^^^^^^

.. code:: typescript

   updateKeyfile(moniker: string, oldpass: string, newpass: string): Promise<IV3Keyfile>

``importKeyfile``
~~~~~~~~~~~~~~~~~

Imports a specified keyfile to the keystore of the data directory.

.. _definition-ts-6:

Definition (TS)
^^^^^^^^^^^^^^^

.. code:: typescript

   importKeyfile(moniker: string, keyfile: IV3Keyfile): Promise<IV3Keyfile>
