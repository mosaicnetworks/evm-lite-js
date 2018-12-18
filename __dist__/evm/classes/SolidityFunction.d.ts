import * as SolFunction from 'web3/lib/web3/function';
import { ABI } from '../..';
import { AddressType, EVMType, Gas, GasPrice } from "../types";
import Transaction from "./Transaction";
export default class SolidityFunction {
    readonly contractAddress: AddressType;
    private host;
    private port;
    readonly name: string;
    readonly inputTypes: EVMType[];
    readonly outputTypes: EVMType[];
    readonly solFunction: SolFunction;
    readonly constant: boolean;
    readonly payable: boolean;
    constructor(abi: ABI, contractAddress: AddressType, host: string, port: number);
    generateTransaction(options: {
        from: AddressType;
        gas: Gas;
        gasPrice: GasPrice;
    }, ...funcArgs: any[]): Transaction;
    unpackOutput(output: string): any;
    private _validateArgs;
    private requireArgsLength;
    private requireSolidityTypes;
}
