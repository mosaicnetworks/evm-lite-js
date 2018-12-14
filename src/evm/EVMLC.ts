import * as fs from 'fs';
import * as JSONBig from 'json-bigint'
import * as solidityCompiler from 'solc'

import {Address, AddressType} from "./types";
import {ABI} from "./utils/Interfaces";

import Transaction, {BaseTX} from "./classes/Transaction";

import SolidityContract from "./classes/SolidityContract";
import DefaultClient from "./client/DefaultClient";


interface UserDefinedDefaultTXOptions extends BaseTX {
    from: string,
}

interface DefaultTXOptions extends BaseTX {
    from: Address,
}

export default class EVMLC extends DefaultClient {

    private readonly defaultTXOptions: DefaultTXOptions;

    constructor(host: string, port: number, private readonly userDefaultTXOptions: UserDefinedDefaultTXOptions) {
        super(host, port);

        this.defaultTXOptions = {
            ...userDefaultTXOptions,
            from: new AddressType(userDefaultTXOptions.from)
        }
    }

    get defaultOptions(): UserDefinedDefaultTXOptions {
        return this.userDefaultTXOptions;
    }

    get defaultFrom(): string {
        return this.defaultTXOptions.from.value;
    }

    set defaultFrom(address: string) {
        this.defaultTXOptions.from = new AddressType(address);
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

    public generateContractFromSolidityFile(contractName: string, filePath: string): SolidityContract {
        const input = fs.readFileSync(filePath).toString();
        const output = solidityCompiler.compile(input, 1);
        const byteCode = output.contracts[`:${contractName}`].bytecode;
        const abi = JSONBig.parse<ABI[]>(output.contracts[`:${contractName}`].interface);

        return new SolidityContract({
            from: this.defaultTXOptions.from,
            jsonInterface: abi,
            data: byteCode,
            gas: this.defaultTXOptions.gas,
            gasPrice: this.defaultTXOptions.gasPrice
        }, this.host, this.port)
    };

    public generateContractFromABI(abi: ABI[]): SolidityContract {
        return new SolidityContract({
            from: this.defaultTXOptions.from,
            jsonInterface: abi,
            gas: this.defaultTXOptions.gas,
            gasPrice: this.defaultTXOptions.gasPrice
        }, this.host, this.port);
    }

    public prepareTransfer(to: string, value: number, from?: string): Transaction {
        from = from || this.defaultFrom;

        if (value <= 0) {
            throw new Error('A transfer of funds must have a value greater than 0.')
        }

        return new Transaction({
            from: new AddressType(from),
            to: new AddressType(to),
            value,
            gas: this.defaultGas,
            gasPrice: this.defaultGasPrice
        }, this.host, this.port, false)
    }

}