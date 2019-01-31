import * as path from 'path';

import { Account, AddressType, DataDirectory } from '../../src';

import evmlc from '../setup';

const directory = new DataDirectory(
	path.join(require('os').homedir(), '.evmlc')
);

const sign = async () => {
	console.group('Sign Transaction');

	const account = await directory.keystore.decryptAccount(
		evmlc.defaultFrom,
		'asd',
		evmlc
	);

	const tx = {
		from: new AddressType(evmlc.defaultFrom),
		to: undefined,
		value: undefined,
		nonce: account.nonce,
		chainId: 1,
		gas: 100000,
		gasPrice: 0,
		data: '112233445566'
	};
	console.log('Transaction: ', tx);

	const signed = await account.signTransaction(tx);

	console.log('Signed: ', signed);

	console.groupEnd();

	return signed;
};

const recover = async () => {
	const decoder = require('ethereum-tx-decoder');
	const account = await directory.keystore.decryptAccount(
		evmlc.defaultFrom,
		'asd',
		evmlc
	);

	const signed = await sign();
	const deconded = decoder.decodeTx(signed.rawTransaction);

	console.log('Recovered: ', deconded);
};

recover();
