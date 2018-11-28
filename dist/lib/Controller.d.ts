import { ABI, BaseTX } from "./evm/utils/Interfaces";
import Account from "./evm/Account";
import Client from "./evm/Client";
import SolidityContract from "./evm/SolidityContract";
import Transaction from "./evm/Transaction";
interface DefaultTXOptions extends BaseTX {
    from?: string;
}
export default class Controller {
    readonly host: string;
    readonly port: number;
    private _defaultTXOptions;
    accounts: Account[];
    readonly api: Client;
    constructor(host: string, port?: number, _defaultTXOptions?: DefaultTXOptions);
    readonly defaultOptions: DefaultTXOptions;
    defaultFrom: string;
    defaultGas: number;
    defaultGasPrice: number;
    ContractFromSolidityFile(contractName: string, filePath: string): SolidityContract;
    ContractFromABI(abi: ABI[]): SolidityContract;
    transfer(to: string, from: string, value: number): Transaction;
    private _requireDefaultFromAddress;
}
export {};
