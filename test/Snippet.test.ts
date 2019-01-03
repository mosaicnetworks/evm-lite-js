import { Account, EVMLC, Keystore } from 'evm-lite-lib';

const evmlc = new EVMLC('127.0.0.1', 8080, {
	from: 'default_from_address',
	gas: 1000000,
	gasPrice: 0
});

const ABI_FOR_CROWD_FUNDING_CONTRACT: [] = [];
const COMPILED_DATA: string = 'data';

const notDeployedContract = evmlc.generateContractFromABI(ABI_FOR_CROWD_FUNDING_CONTRACT);

notDeployedContract.data(COMPILED_DATA);
notDeployedContract.deploy({
	parameters: [10000]
})
	.then((contract) => contract.methods.contribute().value(1000))
	.then((transaction) => transaction.send())
	.then((receipt) => console.log(receipt));

/**
 * Sign Transaction Locally
 */

// Keystore object
const keystore = new Keystore('/Users/danu/.evmlc', 'keystore');

// Transaction Addresses
const from = '0x310a2d9fc5a356c09a2016170b2816857762a5af';
const to = '0x1dEC6F07B50CFa047873A508a095be2552680874';

async function signTransactionLocally() {
	const keystoreFile = await keystore.get(from);
	const decryptedAccount = Account.decrypt(keystoreFile, 'asd'.trim());
	const transaction = await evmlc.prepareTransfer(to, 2000);
	const signedTransaction = await decryptedAccount.signTransaction(transaction);

	return await transaction.sendRaw(signedTransaction.rawTransaction);
}

signTransactionLocally()
	.then((txResponse) => console.log(txResponse));


