EVM-Lite Keystore
=================

Keystore management for any EVM-Lite applications.

Keystore
--------

``constructor``
~~~~~~~~~~~~~~~

.. code:: typescript

   constructor(path: string)

Example
^^^^^^^

.. code:: typescript

   const keystore = new Keystore('<HOME_DIR>/.evmlc/keystore');

``list``
~~~~~~~~

Should list all ``V3Keyfile`` files in the directory specified in the
constructor.

.. code:: typescript

   list(): Promise<MonikerKeystore>

.. _example-1:

Example
^^^^^^^

.. code:: typescript

   keystore
       .list()
       .then(console.log)
       .catch(console.log);

``get``
~~~~~~~

Should get a single ``V3Keyfile`` file.

.. code:: typescript

   get(moniker: string): Promise<V3Keyfile>

.. _example-2:

Example
^^^^^^^

.. code:: typescript

   keystore
       .get('moniker')
       .then(console.log)
       .catch(console.log);

``create``
~~~~~~~~~~

Should create a ``V3Keyfile`` encrypted with the password specified and
place in the directory.

.. code:: typescript

   create(moniker: string, password: string, overridePath?: string): Promise<V3Keyfile>

.. _example-3:

Example
^^^^^^^

.. code:: typescript

   keystore
       .create('supersecurepassword')
       .then(console.log)
       .catch(console.log);

``decrypt``
~~~~~~~~~~~

Should decrypt a ``V3Keyfile`` with the ecrypted password.

.. code:: typescript

   decrypt(keyfile: V3Keyfile, password: string): Account

.. _example-4:

Example
^^^^^^^

.. code:: typescript

   keystore
       .get('moniker')
       .then(keyfile => keystore.decrypt(keyfile, 'supersecurepassword'))
       .then(console.log)
       .catch(console.log);
