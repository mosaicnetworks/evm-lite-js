import { ABI, TXReceipt } from '../..';
import { Address, Data, Gas, GasPrice, Nonce } from '../types';
import Account from './Account';
import Transaction from './Transaction';
interface OverrideContractDeployParameters {
    gas?: Gas;
    gasPrice?: GasPrice;
    data?: Data;
}
export interface ContractOptions {
    gas: Gas;
    gasPrice: GasPrice;
    from: Address;
    address?: Address;
    nonce?: Nonce;
    data?: Data;
    jsonInterface: ABI[];
}
export interface BaseContractSchema {
    [key: string]: (...args: any[]) => Promise<Transaction>;
}
export default class SolidityContract<ContractFunctionSchema extends BaseContractSchema> {
    options: ContractOptions;
    private host;
    private port;
    methods: ContractFunctionSchema | BaseContractSchema;
    web3Contract: any;
    receipt?: TXReceipt;
    constructor(options: ContractOptions, host: string, port: number);
    deploy(account: Account, params?: any[], options?: OverrideContractDeployParameters): Promise<this>;
    setAddressAndPopulateFunctions(address: string): this;
    address(address: string): this;
    gas(gas: Gas): this;
    gasPrice(gasPrice: GasPrice): this;
    data(data: Data): this;
    JSONInterface(abis: ABI[]): this;
    private attachMethodsToContract;
    private encodeConstructorParams;
}
export {};
