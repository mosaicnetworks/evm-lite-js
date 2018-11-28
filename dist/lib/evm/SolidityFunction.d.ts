import * as SolFunction from 'web3/lib/web3/function.js';
import { Controller } from "../../";
import { ABI } from './utils/Interfaces';
import Transaction from "./Transaction";
export default class SolidityFunction {
    readonly contractAddress: string;
    readonly controller: Controller;
    readonly name: string;
    readonly _inputTypes: string[];
    readonly _outputTypes: string[];
    readonly _solFunction: SolFunction;
    readonly _constant: boolean;
    readonly _payable: boolean;
    constructor(abi: ABI, contractAddress: string, controller: Controller);
    generateTransaction(options: {
        gas?: number;
        gasPrice?: number;
    }, ...funcArgs: any[]): Transaction;
    unpackOutput(output: string): any;
    private _validateArgs;
}
