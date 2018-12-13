import {Controller} from '../src';


const connection = new Controller('127.0.0.1', 8080, {
    from: '0xA4a5F65Fb3752b2B6632F2729f17dd61B2aaD650',
    gas: 100000,
    gasPrice: 1
});

const transaction = connection.prepareTransfer('0X0CA23356310E6E1F9D79E4F2A4CD6009A51F6EA0', 1000000);
console.log(transaction.toString());


transaction.send()
    .then((resp) => console.log('SUCCESS', resp))
    .catch((error) => console.log('ERROR', error));