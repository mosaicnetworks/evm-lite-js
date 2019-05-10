import EVM from '../types';

import Transaction, { BaseTransaction } from './transaction/Transaction';

import DefaultClient from '../clients/DefaultClient';
import Accounts from './accounts/Accounts';
import Contracts from './contract/Contracts';

export interface Defaults extends BaseTransaction {
	from: EVM.Address;
}

export default class EVMLC extends DefaultClient {
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
	 * @param defaults - The default values for transactions.
	 *
	 * @alpha
	 */
	constructor(
		host: string,
		port: number,
		private readonly defaults: Defaults
	) {
		super(host, port);

		this.defaults.from = defaults.from.toLowerCase()
	}

	/**
	 * Should return a new instance of the `Accounts` class with default
	 * values set.
	 */
	get accounts(): Accounts {
		return new Accounts(this.host, this.port, {
			from: this.defaultFrom,
			gas: this.defaultGas,
			gasPrice: this.defaultGasPrice
		});
	}

	/**
	 * Should return a new instance of the `Contracts` class with default
	 * values set.
	 */
	get contracts(): Contracts {
		return new Contracts(this.host, this.port, {
			from: this.defaultFrom,
			gas: this.defaultGas,
			gasPrice: this.defaultGasPrice
		});
	}

	/**
	 * The default `from` address that will be used for any transactions
	 * created from this object.
	 */
	get defaultFrom(): EVM.Address {
		return this.defaults.from;
	}

	/**
	 * Set the default `from` to be used for any transactions created from
	 * this object.
	 */
	set defaultFrom(address: EVM.Address) {
		this.defaults.from = address.toLowerCase();
	}

	/**
	 * The default `gas` value that will be used for any transactions created
	 * from this object.
	 */
	get defaultGas(): EVM.Gas {
		return this.defaults.gas;
	}

	/**
	 * Set the default `gas` value to be used for any transactions created from
	 * this object.
	 */
	set defaultGas(gas: EVM.Gas) {
		this.defaults.gas = gas;
	}

	/**
	 * The default `gasPrice` value that will be used for any transactions
	 * created from this object.
	 */
	get defaultGasPrice(): EVM.GasPrice {
		return this.defaults.gasPrice;
	}

	/**
	 * Set the default `gasPrice` to be used for any transactions created from
	 * this object.
	 */
	set defaultGasPrice(gasPrice: EVM.GasPrice) {
		this.defaults.gasPrice = gasPrice;
	}
}
