import { DataDirectory } from '../../src';

const address: string = '0X5E54B1907162D64F9C4C7A46E3547084023DA2A0';
const directory = new DataDirectory('/Users/danu/.evmlc');
const account = directory.keystore.decrypt(address, 'asd');

account.then(account => console.log(account));
