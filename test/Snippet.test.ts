import { Account, EVMLC, Keystore } from '../src';

const evmlc = new EVMLC('127.0.0.1', 8080, {
	from: 'asdasdas',
	gas: 1000000,
	gasPrice: 0
});

const ABI_FOR_CROWD_FUNDING_CONTRACT: [] = [];
const COMPILED_DATA: string = 'data';

evmlc.generateContractFromABI(ABI_FOR_CROWD_FUNDING_CONTRACT)
	.then((contract) => {
		contract.data(COMPILED_DATA);

		return contract.deploy({
			parameters: [1000]
		});
	})
	.then((transaction) => {
		console.log(transaction.tx)
	})
