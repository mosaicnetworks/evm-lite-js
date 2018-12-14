import {EVMLC} from 'evm-lite-lib';

const evmlc = new EVMLC('127.0.0.1', 8080, {
    from: '0xA4a5F65Fb3752b2B6632F2729f17dd61B2aaD650',
    gas: 100000,
    gasPrice: 0
})

const transaction = evmlc.prepareTransfer('0x0ca23356310e6e1f9d79e4f2a4cd6009a51f6ea0', 0);

transaction.send()
    .then((receipt) => console.log(receipt))
    .catch((error) => console.log(error));
