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
	private accountController: Accounts;
	private contractController: Contracts;

	private readonly defaultTXOptions: DefaultTXOptions;

	/**
	 * The root controller class to interact with contracts and accounts.
	 *
	 * @remarks
	 * The `gas`, `gasPrice` and `from` address set in the options for this
	 * constrcutor will be used as a default for any contracts or transfer
	 * transactions created from this object. Note that override capabilities
	 * are provided in the respective functions if required.
	 *
	 * ```typescript
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

		this.defaultTXOptions = {
			...userDefaultTXOptions,
			from: new AddressType(userDefaultTXOptions.from)
		};

		this.contractController = new Contracts(host, port, {
			...this.defaultTXOptions
		});

		this.accountController = new Accounts(host, port, {
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

	/**
	 * The controller class for interacting with Smart Contracts.
	 */
	get contracts() {
		if (this.defaultGas !== this.contractController.defaultGas) {
			this.contractController.defaultGas = this.defaultGas;
		}

		if (this.defaultGasPrice !== this.contractController.defaultGasPrice) {
			this.contractController.defaultGasPrice = this.defaultGasPrice;
		}

		if (this.defaultFrom !== this.contractController.defaultFrom) {
			this.contractController.defaultFrom = this.defaultFrom;
		}

		return this.contractController;
	}

	/**
	 * The controller class for interacting with accounts.
	 */
	get accounts() {
		if (this.defaultGas !== this.accountController.defaultGas) {
			this.accountController.defaultGas = this.defaultGas;
		}

		if (this.defaultGasPrice !== this.accountController.defaultGasPrice) {
			this.accountController.defaultGasPrice = this.defaultGasPrice;
		}

		if (this.defaultFrom !== this.accountController.defaultFrom) {
			this.accountController.defaultFrom = this.defaultFrom;
		}

		return this.accountController;
	}
}
