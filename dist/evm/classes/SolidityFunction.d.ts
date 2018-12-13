import * as SolFunction from 'web3/lib/web3/function.js';
import { EVMType } from 'evm-sol-types';
import { ABI } from '../utils/Interfaces';
import Transaction from "./Transaction";
export default class SolidityFunction {
    readonly contractAddress: string;
    private host;
    private port;
    readonly name: string;
    readonly inputTypes: EVMType[];
    readonly outputTypes: EVMType[];
    readonly solFunction: SolFunction;
    readonly constant: boolean;
    readonly payable: boolean;
    constructor(abi: ABI, contractAddress: string, host: string, port: number);
    generateTransaction(options: {
        from: string;
        gas: number;
        gasPrice: number;
    }, ...funcArgs: any[]): Transaction;
    unpackOutput(output: string): any;
    private _validateArgs;
    private requireArgsLength;
    private requireSolidityTypes;
}
