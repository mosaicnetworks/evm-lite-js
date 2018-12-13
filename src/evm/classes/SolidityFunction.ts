// @ts-ignore
import * as coder from 'web3/lib/solidity/coder.js'
// @ts-ignore
import * as SolFunction from 'web3/lib/web3/function.js'

import * as checks from '../utils/checks'

import {Controller} from "../..";
import {ABI, Input, TX} from '../utils/Interfaces'

import Transaction from "./Transaction";


export default class SolidityFunction {

    public readonly name: string;
    public readonly _inputTypes: string[];
    public readonly _outputTypes: string[];
    public readonly _solFunction: SolFunction;
    public readonly _constant: boolean;
    public readonly _payable: boolean;

    constructor(abi: ABI, readonly contractAddress: string, readonly controller: Controller) {
        this.name = abi.name;
        this._solFunction = new SolFunction('', abi, '');
        this._constant = (abi.stateMutability === "view" || abi.stateMutability === "pure" || abi.constant);
        this._payable = (abi.stateMutability === "payable" || abi.payable);
        this._inputTypes = abi.inputs.map((i: Input) => {
            return i.type;
        });
        this._outputTypes = abi.outputs && abi.outputs.map((i: Input) => {
            return i.type
        }) || [];
    }

    public generateTransaction(options: { gas?: number, gasPrice?: string }, ...funcArgs: any[]): Transaction {
        this._validateArgs(funcArgs);

        const callData = this._solFunction.getData();
        const tx: TX = {
            from: this.controller.defaultOptions.from,
            to: this.contractAddress,
        };

        if (options && options.gas !== undefined && options.gasPrice !== undefined) {
            tx.gas = options.gas;
            tx.gasPrice = options.gasPrice;
        }

        tx.data = callData;

        if (tx.value && tx.value <= 0 && this._payable) {
            throw Error('Function is payable and requires `value` greater than 0.');
        }
        else if (tx.value && tx.value > 0 && !this._payable) {
            throw Error('Function is not payable. Required `value` is 0.');
             }

        let unpackfn: ((output: string) => any) | undefined;

        if (this._constant) {
            unpackfn = this.unpackOutput.bind(this);
        }

        return new Transaction(tx, this.controller.host, this.controller.port, unpackfn);
    }

    public unpackOutput(output: string): any {
        output = output.length >= 2 ? output.slice(2) : output;
        const result = coder.decodeParams(this._outputTypes, output);
        return result.length === 1 ? result[0] : result;
    }

    private _validateArgs(args: any[]): void {
        checks.requireArgsLength(this._inputTypes.length, args.length);

        args.map((a, i) => {
            checks.requireSolidityTypes(this._inputTypes[i], a);
        });
    }

}