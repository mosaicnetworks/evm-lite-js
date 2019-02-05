import { Address, AddressType } from '../../types';
import { BaseTransaction } from '../transaction/Transaction';
import SolidityContract, {
	BaseContractSchema,
	ContractABI
} from './SolidityContract';

import DefaultClient from '../../clients/DefaultClient';

interface ContractDefaultOptions extends BaseTransaction {
	from: Address;
}

export default class Contracts extends DefaultClient {
	/**
	 * The root cotnroller class for interacting with contracts.
	 *
	 * @param host - The host of the active node.
	 * @param port - The port of the HTTP service.
	 * @param contractOptions - The default options for contracts
	 */
	constructor(
		host: string,
		port: number,
		private contractOptions: ContractDefaultOptions
	) {
		super(host, port);
	}

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
	) {
		const data: string = (options && options.data) || '';
		const address =
			options && options.contractAddress
				? new AddressType(options.contractAddress)
				: undefined;

		return this.getAccount(this.contractOptions.from.value.trim()).then(
			account =>
				new SolidityContract<ContractSchema>(
					{
						from: this.contractOptions.from,
						interface: abi,
						gas: this.contractOptions.gas,
						gasPrice: this.contractOptions.gasPrice,
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
	 * The defaults for contracts created from this object.
	 */
	get defaults() {
		return {
			from: this.contractOptions.from.value,
			gas: this.contractOptions.gas,
			gasPrice: this.contractOptions.gasPrice
		};
	}
}
