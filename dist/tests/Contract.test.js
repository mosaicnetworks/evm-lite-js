"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var evm_lite_lib_1 = require("evm-lite-lib");
var from = '0xA4a5F65Fb3752b2B6632F2729f17dd61B2aaD650';
var to = '0x6544a7e3d6f085002764d0ab38f1f80e81d7deab';
var evmlc = new evm_lite_lib_1.EVMLC('127.0.0.1', 8080, {
    from: from,
    gas: 100000,
    gasPrice: 0
});
// const transaction = evmlc.prepareTransfer(to, 200);
// evmlc.getAccount(to)
//     .then ((account) => console.log('Account Before:', account, '\n\n'))
//     .then(() => transaction.send())
//     .then((receipt) => console.log('Transaction Receipt:', receipt, '\n\n'))
//     .then(() => evmlc.getAccount(to))
//     .then((account) => console.log('Account After:', account, '\n\n'))
var unDeployedContract = evmlc.generateContractFromSolidityFile('CrowdFunding', './tests/assets/contract.sol');
unDeployedContract.deploy({
    parameters: [10]
})
    .then(function (deployedContract) {
    return deployedContract.methods.checkGoalReached()
        .call();
})
    .then(function (receipt) {
    console.log(receipt);
});
