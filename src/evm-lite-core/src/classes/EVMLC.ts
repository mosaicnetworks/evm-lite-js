import { Address, AddressType, Gas, GasPrice, Value } from '../types';

import Transaction, { BaseTransaction } from './transaction/Transaction';

import DefaultClient from '../clients/DefaultClient';
import Accounts from './accounts/Accounts';
import Contracts from './contract/Contracts';

interface UserDefinedDefaultTXOptions extends BaseTransaction {
	from: string;
}

interface DefaultTXOptions extends BaseTransaction {
	from: Address;
}

export default class EVMLC extends DefaultClient {
	public accountController: Accounts;
	public contractController: Contracts;

	private readonly defaultTXOptions: DefaultTXOptions;

	/**
	 * The root controller class to interact with contracts and make transfers.
	 *
	 * @remarks
	 * The `gas`, `gasPrice` and `from` address set in the options for this
	 * constrcutor will be used as a default for any contracts or transfer
	 * transactions created from this object. Note that override capabilities
	 * are provided in the respective functions if required.
	 *
	 * ```typescript
	 * // Generate EVMLC connection object
	 * const evmlc = new EVMLC('127.0.0.1', 8080, {
	 *     from: 'DEFAULT_FROM_ADDRESS',
	 *     gas: 1000000,
	 *     gasPrice: 0
	 * });
	 * ```
	 *
	 * @param host - The host address of the node.
	 * @param port - The port of the node.
	 * @param userDefaultTXOptions - The default values for transactions.
	 *
	 * @alpha
	 */
	constructor(
		host: string,
		port: number,
		private readonly userDefaultTXOptions: UserDefinedDefaultTXOptions
	) {
		super(host, port);

		this.accountController = new Accounts();

		this.defaultTXOptions = {
			...userDefaultTXOptions,
			from: new AddressType(userDefaultTXOptions.from)
		};
		this.contractController = new Contracts(host, port, {
			...this.defaultTXOptions
		});
	}

	/**
	 * The default `from` address that will be used for any transactions
	 * created from this object.
	 */
	get defaultFrom(): string {
		return this.defaultTXOptions.from.value;
	}

	/**
	 * Set the default `from` to be used for any transactions created from
	 * this object.
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
	 * Set the default `gas` value to be used for any transactions created from
	 * this object.
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
	 * Set the default `gasPrice` to be used for any transactions created from
	 * this object.
	 */
	set defaultGasPrice(gasPrice: GasPrice) {
		this.defaultTXOptions.gasPrice = gasPrice;
	}

	get contracts() {
		if (
			this.contractController.defaults.from !==
				this.defaultTXOptions.from.value ||
			this.contractController.defaults.gas !==
				this.defaultTXOptions.gas ||
			this.contractController.defaults.gasPrice !==
				this.defaultTXOptions.gasPrice
		) {
			this.contractController = new Contracts(this.host, this.port, {
				from: this.defaultTXOptions.from,
				gas: this.defaultTXOptions.gas,
				gasPrice: this.defaultTXOptions.gasPrice
			});
		}

		return this.contractController;
	}

	get accounts() {
		return this.accountController;
	}

	/**
	 * Should prepare a transaction to transfer `value` to the specified `to`
	 * address.
	 *
	 * @remarks
	 * This function will also fetch the nonce from the node with connection
	 * details specified in the contructor for this class.
	 *
	 * ```typescript
	 * const transfer = async () {
	 *     // Prepare a transfer transaction to submitted after signing
	 *     const transaction = await evmlc.prepareTransfer('TO_ADDRESS', 200);
	 *     // Sign the transaction with a new  account and submit to node.
	 *     await transaction.submit({}, evmlc.accounts.create())
	 * }
	 * ```
	 *
	 * @param to - The address to transfer funds to.
	 * @param value - The amount to transfer.
	 * @param from - Overrides `from` address set in the constructor.
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
