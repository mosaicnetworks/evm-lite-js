const evmlib = require('evm-lite-lib');

// Transaction Addresses
const from = '0x479e8b1b9d8b509755677f6d61d2f7339ba4c0fd';
const to = '0x1dEC6F07B50CFa047873A508a095be2552680874';

// EVMLC object
const evmlc = new evmlib.EVMLC('127.0.0.1', 8080, {
	from,
	gas: 100000,
	gasPrice: 0
});

// Keystore object
const keystore = new evmlib.Keystore('/Users/danu/.evmlc', 'keystore');

async function signTransactionLocally() {

	// Get keystore object from the keystore directory
	// For the from address so we can decrypt and sign
	const keystoreFile = await keystore.get(from);

	// Decrypt the v3JSONKeystore file so expose `sign` function
	const decryptedAccount = evmlib.Account.decrypt(keystoreFile, 'asd');

	// Prepare a transaction with value of 2000
	const transaction = await evmlc.prepareTransfer(to, 2000);

	// Sign transaction and return a new Transaction object
	const signedTransaction = await transaction.sign(decryptedAccount);

	return await signedTransaction.sendRawTX();
}

signTransactionLocally()
	.then((txResponse) => console.log(txResponse))
	.catch((error) => console.log(error));
