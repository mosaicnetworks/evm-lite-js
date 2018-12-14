"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var evm_lite_lib_1 = require("evm-lite-lib");
var evmlc = new evm_lite_lib_1.EVMLC('127.0.0.1', 8080, {
    from: '0xA4a5F65Fb3752b2B6632F2729f17dd61B2aaD650',
    gas: 100000,
    gasPrice: 0
});
var transaction = evmlc.prepareTransfer('0x0ca23356310e6e1f9d79e4f2a4cd6009a51f6ea0', 0);
transaction.send()
    .then(function (receipt) { return console.log(receipt); })
    .catch(function (error) { return console.log(error); });
