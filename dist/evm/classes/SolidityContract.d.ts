import { ABI, ContractOptions, TXReceipt } from "../utils/Interfaces";
export default class SolidityContract {
    options: ContractOptions;
    private host;
    private port;
    methods: any;
    web3Contract: any;
    receipt?: TXReceipt;
    constructor(options: ContractOptions, host: string, port: number);
    deploy(options?: {
        parameters?: any[];
        gas?: number;
        gasPrice?: any;
        data?: string;
    }): Promise<this>;
    setAddressAndPopulate(address: string): this;
    address(address: string): this;
    gas(gas: number): this;
    gasPrice(gasPrice: number): this;
    data(data: string): this;
    JSONInterface(abis: ABI[]): this;
    private attachMethodsToContract;
    private encodeConstructorParams;
}
