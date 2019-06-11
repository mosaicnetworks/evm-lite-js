import Contract, { AbstractSchema } from '../src/Contract';
import Transaction, { TX } from '../src/Transaction';

interface KeybaseSchema extends AbstractSchema {
	addKey: (txOptions: TX, address: string, rating: number) => Transaction;
	getKey: (txOptions: TX, address: string) => Transaction;
}

export const ABI =
	'[{"constant":false,"inputs":[],"name":"getKeys","outputs":[],' +
	'"payable":false,"stateMutability":"nonpayable","type":' +
	'"function"},{"constant":false,"inputs":[{"name":"pubKey"' +
	',"type":"string"},{"name":"rating","type":"uint256"}],"name"' +
	':"addKey","outputs":[],"payable":false,"stateMutability":' +
	'"nonpayable","type":"function"},{"constant":true,"inputs":' +
	'[{"name":"pubKey","type":"string"}],"name":"getKey","outputs"' +
	':[{"name":"key","type":"string"},{"name":"rating","type"' +
	':"uint256"}],"payable":false,"stateMutability":"view","type"' +
	':"function"},{"inputs":[],"payable":false,"stateMutability' +
	'":"nonpayable","type":"constructor"}]';

export const BYTECODE =
	'608060405234801561001057600080fd5b506102ce806100206000396000f' +
	'3006080604052600436106100565763ffffffff7c01000000000000000000' +
	'000000000000000000000000000000000000006000350416632150c518811' +
	'461005b5780639354de6114610072578063d37aec92146100cd575b600080' +
	'fd5b34801561006757600080fd5b506100706101a5565b005b34801561007' +
	'e57600080fd5b506040805160206004803580820135601f81018490048402' +
	'8501840190955284845261007094369492936024939284019190819084018' +
	'382808284375094975050933594506101a79350505050565b3480156100d9' +
	'57600080fd5b506040805160206004803580820135601f810184900484028' +
	'5018401909552848452610126943694929360249392840191908190840183' +
	'8280828437509497506102209650505050505050565b60405180806020018' +
	'3815260200182810382528481815181526020019150805190602001908083' +
	'8360005b83811015610169578181015183820152602001610151565b50505' +
	'050905090810190601f168015610196578082038051600183602003610100' +
	'0a031916815260200191505b50935050505060405180910390f35b565b610' +
	'1af610290565b818152604051835182916000918691908190602084019080' +
	'83835b602083106101e95780518252601f199092019160209182019101610' +
	'1ca565b51815160209384036101000a600019018019909216911617905292' +
	'0194855250604051938490030190922092519092555050505050565b60606' +
	'000826000846040518082805190602001908083835b602083106102575780' +
	'518252601f199092019160209182019101610238565b51815160209384036' +
	'101000a600019018019909216911617905292019485525060405193849003' +
	'01909220549296929550919350505050565b6040805160208101909152600' +
	'08152905600a165627a7a723058207032f47ae63e90f602b4e063778bc814' +
	'd8482e686096a544266fb8e5608ced2f0029';

let contract: Contract<KeybaseSchema>;

describe('Contract.ts', () => {
	it('should create contract with address set', async () => {
		contract = Contract.load(
			JSON.parse(ABI),
			'0xef3f0b13d7b1f2cbf23c97b246e0047fb93f4fdc'
		);

		expect(contract).toBeInstanceOf(Contract);
	});

	it('should error when deploy transaction requested', async () => {
		expect(() => {
			contract.deployTransaction(
				[],
				'0xef3f0b13d7b1f2cbf23c97b246e0047fb93f4fdc',
				1000000,
				10
			);
		}).toThrow(Error);
	});

	it('should generate a constant transaction', async () => {
		const transaction = contract.methods.getKey(
			{ gas: 100000, gasPrice: 0, from: '0x123' },
			'0xef3f0b13d7b1f2cbf23c97b246e0047fb93f4fdc'
		);

		expect(transaction.constant).toBe(true);

		// Constant function hence unpack function should not be undefined
		expect(transaction.unpackfn).not.toBe(undefined);
		expect(typeof transaction.unpackfn).toBe('function');
	});

	it('should generate a non constant transaction', async () => {
		const transaction = contract.methods.addKey(
			{ gas: 100000, gasPrice: 0, from: '0x123' },
			'0xef3f0b13d7b1f2cbf23c97b246e0047fb93f4fdc',
			0
		);

		expect(transaction.constant).toBe(false);
		// Non constant function hence unpack function should be undefined
		expect(transaction.unpackfn).toBe(undefined);
	});
});
