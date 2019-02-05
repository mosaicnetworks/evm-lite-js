import { Address, AddressType, Gas, GasPrice, Value } from '../types';

import Transaction, { BaseTransaction } from './transaction/Transaction';

import SolidityContract, {
	BaseContractSchema,
	ContractABI
} from './contract/SolidityContract';

import DefaultClient from '../clients/DefaultClient';
import Accounts from './accounts/Accounts';

interface UserDefinedDefaultTXOptions extends BaseTransaction {
	from: string;
}

interface DefaultTXOptions extends BaseTransaction {
	from: Address;
}

export default class EVMLC extends DefaultClient {
	public accounts: Accounts;

	private readonly defaultTXOptions: DefaultTXOptions;

	/**
	 * The root controller class to interact with contracts and make transfers.
	 *
	 * @param host - The host address of the node.
	 * @param port - The port of the node.
	 * @param userDefaultTXOptions - The default values for transactions.
	 */
	constructor(
		host: string,
		port: number,
		private readonly userDefaultTXOptions: UserDefinedDefaultTXOptions
	) {
		super(host, port);

		this.accounts = new Accounts();
		this.defaultTXOptions = {
			...userDefaultTXOptions,
			from: new AddressType(userDefaultTXOptions.from)
		};
	}

	/**
	 * The default `from` address that will be used for any transactions
	 * created from this object.
	 */
	get defaultFrom(): string {
		return this.defaultTXOptions.from.value;
	}

	/**
	 * Should allow you to set the default `from` to be used for any
	 * transactions created from this object.
	 */
	set defaultFrom(address: string) {
		this.defaultTXOptions.from = new AddressType(address);
	}

	/**
	 * The default `gas` value that will be used for any transactions created
	 * from this object.
	 */
	get defaultGas(): Gas {
		return this.defaultTXOptions.gas;
	}

	/**
	 * Should allow you to set the default `gas` value to be used for any
	 * transactions created from this object.
	 */
	set defaultGas(gas: Gas) {
		this.defaultTXOptions.gas = gas;
	}

	/**
	 * The default `gasPrice` value that will be used for any transactions
	 * created from this object.
	 */
	get defaultGasPrice(): GasPrice {
		return this.defaultTXOptions.gasPrice;
	}

	/**
	 * Should allow you to set the default `gasPrice` to be used for any
	 * transactions created from this object.
	 */
	set defaultGasPrice(gasPrice: GasPrice) {
		this.defaultTXOptions.gasPrice = gasPrice;
	}

	/**
	 * Should generate a contract abstraction class to interact with the
	 * respective contract.
	 *
	 * @description
	 * Currently only support the compilation of a single solodity `contract`.
	 * This function will also fetch the nonce from the node with connection
	 * details specified in the contructor for this class.
	 *
	 * @param abi - The interface of the respective contract.
	 * @param options - (optional) The `data` and `contractAddress` options.
	 */
	public loadContract<ContractSchema extends BaseContractSchema>(
		abi: ContractABI,
		options?: { data?: string; contractAddress?: string }
	): Promise<SolidityContract<ContractSchema>> {
		if (!this.defaultTXOptions.from.value) {
			throw new Error(
				'Default from address cannot be left blank or empty!'
			);
		}

		const data: string = (options && options.data) || '';
		const address =
			options && options.contractAddress
				? new AddressType(options.contractAddress)
				: undefined;

		return this.getAccount(this.defaultFrom.trim()).then(
			account =>
				new SolidityContract<ContractSchema>(
					{
						from: this.defaultTXOptions.from,
						interface: abi,
						gas: this.defaultTXOptions.gas,
						gasPrice: this.defaultTXOptions.gasPrice,
						nonce: account.nonce,
						address,
						data
					},
					this.host,
					this.port
				)
		);
	}

	/**
	 * Should prepare a transaction to transfer `value` to the specified `to`
	 * address.
	 *
	 * @description
	 * This function will also fetch the nonce from the node with connection
	 * details specified in the contructor for this class.
	 *
	 * @param to - The address to transfer funds to.
	 * @param value - The amount to transfer.
	 * @param from - (optional) Overrides `from` address set in the constructor.
	 */
	public prepareTransfer(
		to: string,
		value: Value,
		from?: string
	): Promise<Transaction> {
		const fromObject = new AddressType((from || this.defaultFrom).trim());

		if (!fromObject.value) {
			throw new Error(
				'Default `from` address cannot be left blank or empty.'
			);
		}

		if (!to) {
			throw new Error('Must provide a `to` address!');
		}

		if (value <= 0) {
			throw new Error(
				'A transfer of funds must have a `value` greater than 0.'
			);
		}

		return this.getAccount(fromObject.value).then(
			account =>
				new Transaction(
					{
						from: fromObject,
						to: new AddressType(to.trim()),
						value,
						gas: this.defaultGas,
						gasPrice: this.defaultGasPrice,
						nonce: account.nonce,
						chainId: 1
					},
					this.host,
					this.port,
					false
				)
		);
	}
}
