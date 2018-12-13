import * as path from 'path';

import {Controller as Connection} from 'evm-lite-lib';

const connection = new Connection('127.0.0.1', 8080, {
    from: '0xA4a5F65Fb3752b2B6632F2729f17dd61B2aaD650',
    gas: 100000,
    gasPrice: 0
})


const unDeployedContract = connection.ContractFromSolidityFile('CrowdFunding', path.resolve('tests/assets/contract.sol'));

let deployedContract: any;

unDeployedContract.deploy({
    parameters: [10]
})
    .then((contract) => {
        deployedContract = contract;

        const transaction = contract.methods.contribute().value(11)
        console.log(transaction.toString())

        return transaction.send()
            .then((resp) => {
                console.log(resp);
                return contract;
            })
    })
    .then((contract) => {
        const transaction = contract.methods.checkGoalReached();

        transaction.call()
            .then((res) => console.log(res))
            .then(() => {
                connection.getAccount(deployedContract.options.address)
                    .then((account) => console.log(account))
            })
    })
    .catch((error) => console.log(error));


