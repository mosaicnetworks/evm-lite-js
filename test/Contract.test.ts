import { BaseContractFunctionSchema, EVMLC, Transaction } from '../src';

interface CrowdFundingSchema extends BaseContractFunctionSchema {
	contribute: () => Transaction;
	checkGoalReached: () => Transaction;
	settle: () => Transaction;
	otherFunction: (address: string, data: number) => Transaction;
}

const ABI: any[] = [];
const data: string = 'DATA';

const from = '0x0f22af88f03ab6633ea8d15dbc90721d2c1dc73f';

const evmlc = new EVMLC('127.0.0.1', 8080, {
	from,
	gas: 1000000,
	gasPrice: 0
});

const generateContract = async () => {
	const contract = await evmlc.generateContractFromABI<CrowdFundingSchema>(ABI);
};

generateContract()
	.then();
