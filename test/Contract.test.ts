import { EVMLC } from 'evm-lite-lib';


const evmlc = new EVMLC('127.0.0.1', 8080, {
	from: 'default_from_address',
	gas: 1000000,
	gasPrice: 0
});

const ABI_FOR_CROWD_FUNDING_CONTRACT: [] = [];
const COMPILED_DATA: string = 'data';

const notDeployedContract = evmlc.generateContractFromABI(ABI_FOR_CROWD_FUNDING_CONTRACT);

notDeployedContract.data(COMPILED_DATA);
notDeployedContract.deploy({
	parameters: [10000]
})
	.then((contract) => contract.methods.contribute().value(1000))
	.then((transaction) => transaction.send())
	.then((receipt) => console.log(receipt));
