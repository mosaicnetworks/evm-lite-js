import { Address, AddressType, Gas, GasPrice } from '../../types';
import { BaseTransaction } from '../transaction/Transaction';
import Contract, { BaseContractSchema, ContractABI } from './Contract';

interface ContractDefaultOptions extends BaseTransaction {
	from: Address;
}

export default class Contracts {
	/**
	 * The root cotnroller class for interacting with contracts.
	 *
	 * @param host - The host of the active node.
	 * @param port - The port of the HTTP service.
	 * @param contractOptions - The default options for contracts
	 */
	constructor(
		public readonly host: string,
		public readonly port: number,
		private contractOptions: ContractDefaultOptions
	) {}

	/**
	 * Should generate a contract abstraction class to interact with the
	 * respective contract.
	 *
	 * @remarks
	 * Currently only support the compilation of a single solidity `contract`.
	 * This function will also fetch the nonce from the node with connection
	 * details specified in the contructor for this class.
	 *
	 * ```typescript
	 * const contract = await evmlc.contracts.load(ABI, {
	 *     data: 'BYTE_CODE',
	 *     contractAddress: 'IF_ALERADY_DEPLOYED'
	 * });
	 * ```
	 *
	 * @param abi - The interface of the respective contract.
	 * @param options - The `data` and `contractAddress` options.
	 *
	 * @alpha
	 */
	public load<ContractSchema extends BaseContractSchema>(
		abi: ContractABI,
		options?: {
			data?: string;
			contractAddress?: string;
		}
	): Contract<ContractSchema> {
		const data: string = (options && options.data) || '';
		const address =
			options && options.contractAddress
				? new AddressType(options.contractAddress)
				: undefined;

		return new Contract<ContractSchema>(
			{
				from: this.contractOptions.from,
				interface: abi,
				gas: this.contractOptions.gas,
				gasPrice: this.contractOptions.gasPrice,
				address,
				data
			},
			this.host,
			this.port
		);
	}

	/**
	 * The defaults for contracts created from this object.
	 */
	get defaults() {
		return {
			from: this.contractOptions.from.value,
			gas: this.contractOptions.gas,
			gasPrice: this.contractOptions.gasPrice
		};
	}

	/**
	 * The default `from` address that will be used for any contracts
	 * created from this object.
	 */
	get defaultFrom(): string {
		return this.contractOptions.from.value;
	}

	/**
	 * Set the default `from` to be used for any contracts created from
	 * this object.
	 */
	set defaultFrom(address: string) {
		this.contractOptions.from = new AddressType(address);
	}

	/**
	 * The default `gas` value that will be used for any contracts created
	 * from this object.
	 */
	get defaultGas(): Gas {
		return this.contractOptions.gas;
	}

	/**
	 * Set the default `gas` value to be used for any contracts created from
	 * this object.
	 */
	set defaultGas(gas: Gas) {
		this.contractOptions.gas = gas;
	}

	/**
	 * The default `gasPrice` value that will be used for any contracts
	 * created from this object.
	 */
	get defaultGasPrice(): GasPrice {
		return this.contractOptions.gasPrice;
	}

	/**
	 * Set the default `gasPrice` to be used for any contracts created from
	 * this object.
	 */
	set defaultGasPrice(gasPrice: GasPrice) {
		this.contractOptions.gasPrice = gasPrice;
	}
}
