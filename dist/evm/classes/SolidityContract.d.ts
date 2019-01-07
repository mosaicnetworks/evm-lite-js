import { ABI, TXReceipt } from '../..';
import { Address, Data, Gas, GasPrice, Nonce } from '../types';
import Transaction from './Transaction';
export interface ContractOptions {
    gas: Gas;
    gasPrice: GasPrice;
    from: Address;
    address?: Address;
    nonce?: Nonce;
    data?: Data;
    jsonInterface: ABI[];
}
export default class SolidityContract {
    options: ContractOptions;
    private host;
    private port;
    methods: {
        [key: string]: () => Transaction;
    };
    web3Contract: any;
    receipt?: TXReceipt;
    constructor(options: ContractOptions, host: string, port: number);
    deploy(options?: {
        parameters?: any[];
        gas?: Gas;
        gasPrice?: GasPrice;
        data?: Data;
    }): Transaction;
    setAddressAndPopulate(address: string): this;
    address(address: string): this;
    gas(gas: Gas): this;
    gasPrice(gasPrice: GasPrice): this;
    data(data: Data): this;
    JSONInterface(abis: ABI[]): this;
    private attachMethodsToContract;
    private encodeConstructorParams;
}
