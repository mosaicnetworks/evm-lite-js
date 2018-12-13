import * as fs from 'fs';
import * as JSONBig from 'json-bigint'
import * as solidityCompiler from 'solc'

import {ABI, BaseTX} from "./utils/Interfaces";

import Account from "./classes/Account"
import SolidityContract from "./classes/SolidityContract";
import Transaction from "./classes/Transaction";
import Client from "./client/Client";


interface DefaultTXOptions extends BaseTX {
    from: string,
}

export default class Controller {

    public accounts: Account[];
    public readonly api: Client;

    constructor(readonly host: string, readonly port: number = 8080, private readonly defaultTXOptions: DefaultTXOptions) {
        this.accounts = [];
        this.api = new Client(host, port);

        this.defaultTXOptions = {
            gas: defaultTXOptions.gas || 0,
            gasPrice: defaultTXOptions.gasPrice || '',
            from: defaultTXOptions.from || '',
        }
    }

    get defaultOptions(): DefaultTXOptions {
        return this.defaultTXOptions;
    }

    get defaultFrom(): string {
        return this.defaultTXOptions.from;
    }

    set defaultFrom(address: string) {
        this.defaultTXOptions.from = address;
    }

    get defaultGas(): number {
        return this.defaultTXOptions.gas || 0;
    }

    set defaultGas(gas: number) {
        this.defaultTXOptions.gas = gas;
    }

    get defaultGasPrice(): string {
        return this.defaultTXOptions.gasPrice || '';
    }

    set defaultGasPrice(gasPrice: string) {
        this.defaultTXOptions.gasPrice = gasPrice;
    }

    public ContractFromSolidityFile(contractName: string, filePath: string): SolidityContract {
        const input = fs.readFileSync(filePath).toString();
        const output = solidityCompiler.compile(input, 1);
        const byteCode = output.contracts[`:${contractName}`].bytecode;
        const abi = JSONBig.parse<ABI[]>(output.contracts[`:${contractName}`].interface);

        return new SolidityContract({
            jsonInterface: abi,
            data: byteCode,
            gas: this.defaultTXOptions.gas,
            gasPrice: this.defaultTXOptions.gasPrice
        }, this)
    };

    public ContractFromABI(abi: ABI[]): SolidityContract {
        return new SolidityContract({
            jsonInterface: abi,
            gas: this.defaultTXOptions.gas,
            gasPrice: this.defaultTXOptions.gasPrice
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
            gas: this.defaultTXOptions.gas,
            gasPrice: this.defaultTXOptions.gasPrice
        }, false, () => null, this)
    }

}