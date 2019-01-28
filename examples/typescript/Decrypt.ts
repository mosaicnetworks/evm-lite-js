import { Account, DataDirectory, EVMLC } from '../../src';

const address: string = '0X5E54B1907162D64F9C4C7A46E3547084023DA2A0';
const directory = new DataDirectory('/Users/danu/.evmlc');
const account = directory.keystore.decrypt(address, 'asd');
const evmlc = new EVMLC('127.0.0.1', 8080, {
	from: address,
	gas: 1000000,
	gasPrice: 0
});

account.then(async account => {
	const transaction = await evmlc.prepareTransfer(
		'0x38CB86c8123e68164390259D022b5D2afffCB273',
		10
	);

	await transaction.sign(account);

	console.log('Account', account);
	console.log('Transaction', transaction);

	return account;
});
