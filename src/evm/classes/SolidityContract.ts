import * as Web3 from 'web3'
import * as coder from 'web3/lib/solidity/coder.js'

import * as checks from '../utils/checks';
import * as errors from "../utils/errors"

import {ABI, ContractOptions, TXReceipt} from "../utils/Interfaces";

import Controller from "../Controller";
import SolidityFunction from "./SolidityFunction";
import Transaction from "./Transaction";


export default class SolidityContract {

    public methods: any;
    public web3Contract: any;
    public receipt: TXReceipt;

    constructor(public options: ContractOptions, readonly controller: Controller) {
        const web3 = new Web3();

        this.options.address = options.address || '';
        // this.web3Contract = web3.eth.contract(this.options.jsonInterface).at(this.options.address);
        this.receipt = undefined;
        this.methods = {};

        if (this.options.address !== undefined) {
            this._attachMethodsToContract();
        }
    }

    public deploy(options?: { parameters?: any[], gas?: number, gasPrice?: any, data?: string }) {
        if (this.options.address !== '') {
            throw errors.ContractAddressFieldSetAndDeployed();
        }

        this.options.jsonInterface.filter((abi: ABI) => {
            if (abi.type === "constructor" && options.parameters) {
                checks.requireArgsLength(abi.inputs.length, options.parameters.length);
            }
        });

        if (options) {
            this.options.data = options.data || this.options.data;
            this.options.gas = options.gas || this.options.gas;
            this.options.gasPrice = options.gasPrice || this.options.gasPrice;
        }

        if (this.options.data) {
            let encodedData: string;

            if (options.parameters) {
                encodedData = this.options.data + this._encodeConstructorParams(options.parameters);
            }

            return new Transaction({
                from: this.controller.defaultOptions.from,
                data: encodedData
            }, false, undefined, this.controller)
                .gas(this.options.gas)
                .gasPrice(this.options.gasPrice)
                .send().then((receipt: TXReceipt) => {
                    this.receipt = receipt;
                    return this.setAddressAndPopulate(this.receipt.contractAddress);
                });
        } else {
            throw errors.InvalidDataFieldInOptions();
        }
    }

    public setAddressAndPopulate(address: string): this {
        this.options.address = address;
        this._attachMethodsToContract();
        return this
    }

    public address(address: string): this {
        this.options.address = address;
        return this
    }

    public gas(gas: number): this {
        this.options.gas = gas;
        return this
    }

    public gasPrice(gasPrice: number): this {
        this.options.gasPrice = gasPrice;
        return this
    }

    public data(data: string): this {
        this.options.data = data;
        return this
    }

    public JSONInterface(abis: ABI[]): this {
        this.options.jsonInterface = abis;
        return this
    }

    private _attachMethodsToContract(): void {
        this.options.jsonInterface.filter((json) => {
            return json.type === 'function';
        })
            .map((funcJSON: ABI) => {
                const solFunction = new SolidityFunction(funcJSON, this.options.address, this.controller);

                if (this.options.gas !== undefined && this.options.gasPrice !== undefined) {
                    this.methods[funcJSON.name] = solFunction.generateTransaction.bind(solFunction, {
                        gas: this.options.gas,
                        gasPrice: this.options.gasPrice,
                    });
                } else {
                    this.methods[funcJSON.name] = solFunction.generateTransaction.bind(solFunction, {});
                }
            })
    }

    private _encodeConstructorParams(params: any[]): any {
        return this.options.jsonInterface.filter((json) => {
            return json.type === 'constructor' && json.inputs.length === params.length;
        })
            .map((json) => {
                return json.inputs.map((input) => {
                    return input.type;
                });
            })
            .map((types) => {
                return coder.encodeParams(types, params);
            })[0] || '';
    }

}