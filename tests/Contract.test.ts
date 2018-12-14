import {Account, EVMLC, Keystore} from 'evm-lite-lib';
import {AddressType} from "../src/evm/types";


const evmlc = new EVMLC('127.0.0.1', 8080, {
    from: '0x6544a7e3d6f085002764d0ab38f1f80e81d7deab',
    gas: 100000,
    gasPrice: 0
});
const keystore = new Keystore('/Users/danu/.evmlc/keystore');

keystore.get('0x6544a7e3d6f085002764d0ab38f1f80e81d7deab')
    .then(response => {
        return JSON.parse(response);
    })
    .then((account) => {
        const acc = Account.decrypt(account, 'asd');
        const transaction = evmlc.prepareTransfer('0xA4a5F65Fb3752b2B6632F2729f17dd61B2aaD650', 100);


        acc.signTransaction({
            ...transaction.tx,
            chainId: 1,
            nonce: 1
        })
            .then((signedtx) => console.log(signedtx.rawTransaction));
    });

keystore.create('asd')
    .then((response) => {
        return JSON.parse(response)
    })
    .then(account => {
        return Account.decrypt(account, 'asd');
    })
    .then((account) => {
        const tx = {
            from: new AddressType(account.address),
            to: new AddressType('0xA4a5F65Fb3752b2B6632F2729f17dd61B2aaD650'),
            value: 100,
            gas: 100000,
            gasPrice: 0,
            chainId: 1,
            nonce: 1
        };

        account.signTransaction(tx)
            .then((resp: any) => console.log(resp))
            .catch((error: any) => console.log(error))
    });
