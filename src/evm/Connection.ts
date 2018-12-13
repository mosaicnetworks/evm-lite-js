// import * as fs from 'fs';
// import * as JSONBig from 'json-bigint'
// import * as solidityCompiler from 'solc'

import {BaseTX} from "./utils/Interfaces";

// import SolidityContract from "./classes/SolidityContract";
import Transaction from "./classes/Transaction";
import DefaultClient from "./client/DefaultClient";


interface DefaultTXOptions extends BaseTX {
    from: string,
}

export default class Connection extends DefaultClient {

    constructor(host: string, port: number, private readonly defaultTXOptions: DefaultTXOptions) {
        super(host, port);
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
        return this.defaultTXOptions.gas;
    }

    set defaultGas(gas: number) {
        this.defaultTXOptions.gas = gas;
    }

    get defaultGasPrice(): number {
        return this.defaultTXOptions.gasPrice;
    }

    set defaultGasPrice(gasPrice: number) {
        this.defaultTXOptions.gasPrice = gasPrice;
    }

    // public ContractFromSolidityFile(contractName: string, filePath: string): SolidityContract {
    //     const input = fs.readFileSync(filePath).toString();
    //     const output = solidityCompiler.compile(input, 1);
    //     const byteCode = output.contracts[`:${contractName}`].bytecode;
    //     const abi = JSONBig.parse<ABI[]>(output.contracts[`:${contractName}`].interface);
    //
    //     return new SolidityContract({
    //         from: this.defaultTXOptions.from,
    //         jsonInterface: abi,
    //         data: byteCode,
    //         gas: this.defaultTXOptions.gas,
    //         gasPrice: this.defaultTXOptions.gasPrice
    //     }, this.host, this.port)
    // };
    //
    // public ContractFromABI(abi: ABI[]): SolidityContract {
    //     return new SolidityContract({
    //         from: this.defaultTXOptions.from,
    //         jsonInterface: abi,
    //         gas: this.defaultTXOptions.gas,
    //         gasPrice: this.defaultTXOptions.gasPrice
    //     }, this.host, this.port);
    // }

    public prepareTransfer(to: string, value: number, from?: string): Transaction {
        from = from || this.defaultFrom;

        return new Transaction({
            from,
            to,
            value,
            gas: this.defaultGas,
            gasPrice: this.defaultGasPrice
        }, this.host, this.port)
    }

}