import { ABI, ContractOptions, TXReceipt } from "./utils/Interfaces";
import Controller from "../Controller";
export default class SolidityContract {
    options: ContractOptions;
    readonly controller: Controller;
    methods: any;
    web3Contract: any;
    receipt: TXReceipt;
    constructor(options: ContractOptions, controller: Controller);
    deploy(options?: {
        parameters?: any[];
        gas?: number;
        gasPrice?: any;
        data?: string;
    }): any;
    setAddressAndPopulate(address: string): this;
    address(address: string): this;
    gas(gas: number): this;
    gasPrice(gasPrice: number): this;
    data(data: string): this;
    JSONInterface(abis: ABI[]): this;
    private _attachMethodsToContract;
    private _encodeConstructorParams;
}
