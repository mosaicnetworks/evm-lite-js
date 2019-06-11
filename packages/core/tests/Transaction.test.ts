import Account from '../src/Account';
import Transaction from '../src/Transaction';

const first = Account.create();
const second = Account.create();

// Bytecode is never submitted just used as a value for testing
const BYTECODE = '60806040523480156100105760008';

describe('Transaction.ts', () => {
	it('should prefix `0x`s to addresses and `data` attribute', () => {
		const transaction = new Transaction(
			{
				from: first.address.slice(2, first.address.length),
				to: second.address.slice(2, second.address.length),
				data: BYTECODE,
				value: 10,
				gas: 100000000,
				gasPrice: 0
			},
			true
		);

		transaction.beforeSubmission();

		expect(transaction.from.startsWith('0x')).toBe(true);
		expect(transaction.to && transaction.to.startsWith('0x')).toBe(true);
		expect(transaction.data && transaction.data.startsWith('0x')).toBe(
			true
		);
	});

	it('should throw error for `from` address length greater than 42', () => {
		const transaction = new Transaction(
			{
				from: first.address.slice(2, first.address.length) + '123',
				to: second.address.slice(2, second.address.length),
				data: BYTECODE,
				value: 10,
				gas: 100000000,
				gasPrice: 0
			},
			true
		);

		expect(() => transaction.beforeSubmission()).toThrow(Error);
	});

	it('should throw error for `to` address length greater than 42', () => {
		const transaction = new Transaction(
			{
				from: first.address.slice(2, first.address.length),
				to: second.address.slice(2, second.address.length) + '123',
				data: BYTECODE,
				value: 10,
				gas: 100000000,
				gasPrice: 0
			},
			true
		);

		expect(() => transaction.beforeSubmission()).toThrow(Error);
	});

	it('should throw error for `from` address length less than 42', () => {
		const transaction = new Transaction(
			{
				from: first.address.slice(2, first.address.length - 4),
				to: second.address.slice(2, second.address.length),
				data: BYTECODE,
				value: 10,
				gas: 100000000,
				gasPrice: 0
			},
			true
		);

		expect(() => transaction.beforeSubmission()).toThrow(Error);
	});

	it('should throw error for `to` address length less than 42', () => {
		const transaction = new Transaction(
			{
				from: first.address.slice(2, first.address.length),
				to: second.address.slice(2, second.address.length - 4),
				data: BYTECODE,
				value: 10,
				gas: 100000000,
				gasPrice: 0
			},
			true
		);

		expect(() => transaction.beforeSubmission()).toThrow(Error);
	});
});
