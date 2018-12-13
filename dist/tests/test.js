"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var connection = new src_1.Controller('127.0.0.1', 8080, {
    from: '0xA4a5F65Fb3752b2B6632F2729f17dd61B2aaD650',
    gas: 100000,
    gasPrice: 1
});
var transaction = connection.prepareTransfer('0X0CA23356310E6E1F9D79E4F2A4CD6009A51F6EA0', 1000000);
console.log(transaction.toString());
transaction.send()
    .then(function (resp) { return console.log('SUCCESS', resp); })
    .catch(function (error) { return console.log('ERROR', error); });
