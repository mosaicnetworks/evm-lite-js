import Transaction, { BaseTX } from "./classes/Transaction";
import { ABI } from "./utils/Interfaces";
import SolidityContract from "./classes/SolidityContract";
import DefaultClient from "./client/DefaultClient";
interface DefaultTXOptions extends BaseTX {
    from: string;
}
export default class Connection extends DefaultClient {
    private readonly defaultTXOptions;
    constructor(host: string, port: number, defaultTXOptions: DefaultTXOptions);
    readonly defaultOptions: DefaultTXOptions;
    defaultFrom: string;
    defaultGas: number;
    defaultGasPrice: number;
    ContractFromSolidityFile(contractName: string, filePath: string): SolidityContract;
    ContractFromABI(abi: ABI[]): SolidityContract;
    prepareTransfer(to: string, value: number, from?: string): Transaction;
}
export {};
