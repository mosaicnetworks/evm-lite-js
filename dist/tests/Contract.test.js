"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var evm_lite_lib_1 = require("evm-lite-lib");
var types_1 = require("../src/evm/types");
var evmlc = new evm_lite_lib_1.EVMLC('127.0.0.1', 8080, {
    from: '0x6544a7e3d6f085002764d0ab38f1f80e81d7deab',
    gas: 100000,
    gasPrice: 0
});
var keystore = new evm_lite_lib_1.Keystore('/Users/danu/.evmlc/keystore');
keystore.get('0x6544a7e3d6f085002764d0ab38f1f80e81d7deab')
    .then(function (response) {
    return JSON.parse(response);
})
    .then(function (account) {
    var acc = evm_lite_lib_1.Account.decrypt(account, 'asd');
    var transaction = evmlc.prepareTransfer('0xA4a5F65Fb3752b2B6632F2729f17dd61B2aaD650', 100);
    acc.signTransaction(__assign({}, transaction.tx, { chainId: 1, nonce: 1 }))
        .then(function (signedtx) { return console.log(signedtx.rawTransaction); });
});
keystore.create('asd')
    .then(function (response) {
    return JSON.parse(response);
})
    .then(function (account) {
    return evm_lite_lib_1.Account.decrypt(account, 'asd');
})
    .then(function (account) {
    var tx = {
        from: new types_1.AddressType(account.address),
        to: new types_1.AddressType('0xA4a5F65Fb3752b2B6632F2729f17dd61B2aaD650'),
        value: 100,
        gas: 100000,
        gasPrice: 0,
        chainId: 1,
        nonce: 1
    };
    account.signTransaction(tx)
        .then(function (resp) { return console.log(resp); })
        .catch(function (error) { return console.log(error); });
});
