import { Defaults } from '../EVMLC';
import { BaseTransaction } from '../transaction/Transaction';

import Contract, { BaseContractSchema, ContractABI } from './Contract';

import EVM from '../../types';

export default class Contracts {
	/**
	 * The root cotnroller class for interacting with contracts.
	 *
	 * @param host - The host of the active node.
	 * @param port - The port of the HTTP service.
	 * @param defaults - The default options for contracts
	 */
	constructor(
		public readonly host: string,
		public readonly port: number,
		private defaults: Defaults
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
			data?: EVM.Data;
			contractAddress?: EVM.Address;
		}
	): Contract<ContractSchema> {
		const data: EVM.Data = (options && options.data) || '';
		const address =
			options && options.contractAddress
				? options.contractAddress
				: undefined;

		return new Contract<ContractSchema>(
			{
				from: this.defaults.from,
				interface: abi,
				gas: this.defaults.gas,
				gasPrice: this.defaults.gasPrice,
				address,
				data
			},
			this.host,
			this.port
		);
	}
}
