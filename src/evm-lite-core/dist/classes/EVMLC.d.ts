import { Gas, GasPrice, Value } from '../types';
import Transaction, { BaseTX } from './Transaction';
import SolidityContract, { BaseContractSchema, ContractABI } from './SolidityContract';
import Accounts from '../classes/Accounts';
import DefaultClient from '../client/DefaultClient';
interface UserDefinedDefaultTXOptions extends BaseTX {
    from: string;
}
export default class EVMLC extends DefaultClient {
    private readonly userDefaultTXOptions;
    accounts: Accounts;
    private readonly defaultTXOptions;
    /**
     * The root controller class to interact with contracts and make transfers.
     *
     * @param host - The host address of the node.
     * @param port - The port of the node.
     * @param userDefaultTXOptions - The default values for transactions.
     */
    constructor(host: string, port: number, userDefaultTXOptions: UserDefinedDefaultTXOptions);
    /**
     * The default `from` address that will be used for any transactions
     * created from this object.
     */
    /**
    * Should allow you to set the default `from` to be used for any
    * transactions created from this object.
    */
    defaultFrom: string;
    /**
     * The default `gas` value that will be used for any transactions created
     * from this object.
     */
    /**
    * Should allow you to set the default `gas` value to be used for any
    * transactions created from this object.
    */
    defaultGas: Gas;
    /**
     * The default `gasPrice` value that will be used for any transactions
     * created from this object.
     */
    /**
    * Should allow you to set the default `gasPrice` to be used for any
    * transactions created from this object.
    */
    defaultGasPrice: GasPrice;
    /**
     * Should generate a contract abstraction class to interact with the
     * respective contract.
     *
     * @description
     * This function will also fetch the nonce from the node with connection
     * details specified in the contructor for this class.
     *
     * @param abi - The interface of the respective contract.
     * @param options - (optional) The `data` and `contractAddress` options.
     */
    loadContract<ContractSchema extends BaseContractSchema>(abi: ContractABI, options?: {
        data?: string;
        contractAddress?: string;
    }): Promise<SolidityContract<ContractSchema>>;
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
    prepareTransfer(to: string, value: Value, from?: string): Promise<Transaction>;
}
export {};
