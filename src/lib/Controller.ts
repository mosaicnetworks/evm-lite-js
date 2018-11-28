import * as fs from "fs";
import * as JSONBig from 'json-bigint'
// import * as solidityCompiler from 'solc'

import {ABI, BaseTX, SolidityCompilerOutput} from "./evm/utils/Interfaces";

import Account from "./evm/Account"
import Client from "./evm/Client";
import SolidityContract from "./evm/SolidityContract";
import Transaction from "./evm/Transaction";


interface DefaultTXOptions extends BaseTX {
    from?: string,
}

export default class Controller {

    public accounts: Account[];
    public readonly api: Client;

    constructor(readonly host: string, readonly port: number = 8080, private _defaultTXOptions: DefaultTXOptions = {}) {
        this.accounts = [];
        this.api = new Client(host, port);
    }

    get defaultOptions(): DefaultTXOptions {
        return this._defaultTXOptions;
    }

    get defaultFrom(): string {
        return this._defaultTXOptions.from;
    }

    set defaultFrom(address: string) {
        this._defaultTXOptions.from = address;
    }

    get defaultGas(): number {
        return this._defaultTXOptions.gas;
    }

    set defaultGas(gas: number) {
        this._defaultTXOptions.gas = gas;
    }

    get defaultGasPrice(): number {
        return this._defaultTXOptions.gasPrice;
    }

    set defaultGasPrice(gasPrice: number) {
        this._defaultTXOptions.gasPrice = gasPrice;
    }

    public ContractFromSolidityFile(contractName: string, filePath: string): SolidityContract {
        this._requireDefaultFromAddress();

        // const input = fs.readFileSync(filePath).toString();
        // const output: SolidityCompilerOutput = solidityCompiler.compile(input, 1);
        // const byteCode = output.contracts[`:${contractName}`].bytecode;
        // const abi = JSONBig.parse(output.contracts[`:${contractName}`].interface);

        return new SolidityContract({
            jsonInterface: [],
            data: '',
            gas: this._defaultTXOptions.gas || undefined,
            gasPrice: this._defaultTXOptions.gasPrice || undefined
        }, this)
    };

    public ContractFromABI(abi: ABI[]): SolidityContract {
        this._requireDefaultFromAddress();

        return new SolidityContract({
            jsonInterface: abi,
            gas: this._defaultTXOptions.gas || undefined,
            gasPrice: this._defaultTXOptions.gasPrice || undefined
        }, this);
    }

    public transfer(to: string, from: string, value: number): Transaction {
        if (from === '') {
            from = this.defaultOptions.from;
        }

        return new Transaction({
            from,
            to,
            value,
            gas: this._defaultTXOptions.gas || undefined,
            gasPrice: this._defaultTXOptions.gasPrice || undefined
        }, false, undefined, this)
    }

    private _requireDefaultFromAddress(): void {
        if (this._defaultTXOptions.from == null) {
            throw new Error('Set default `from` address. use `EVML.defaultFrom(<address>)`');
        }
    };

}