"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("./evm/Client");
const SolidityContract_1 = require("./evm/SolidityContract");
const Transaction_1 = require("./evm/Transaction");
class Controller {
    constructor(host, port = 8080, _defaultTXOptions = {}) {
        this.host = host;
        this.port = port;
        this._defaultTXOptions = _defaultTXOptions;
        this.accounts = [];
        this.api = new Client_1.default(host, port);
    }
    get defaultOptions() {
        return this._defaultTXOptions;
    }
    get defaultFrom() {
        return this._defaultTXOptions.from;
    }
    set defaultFrom(address) {
        this._defaultTXOptions.from = address;
    }
    get defaultGas() {
        return this._defaultTXOptions.gas;
    }
    set defaultGas(gas) {
        this._defaultTXOptions.gas = gas;
    }
    get defaultGasPrice() {
        return this._defaultTXOptions.gasPrice;
    }
    set defaultGasPrice(gasPrice) {
        this._defaultTXOptions.gasPrice = gasPrice;
    }
    ContractFromSolidityFile(contractName, filePath) {
        this._requireDefaultFromAddress();
        // const input = fs.readFileSync(filePath).toString();
        // const output: SolidityCompilerOutput = solidityCompiler.compile(input, 1);
        // const byteCode = output.contracts[`:${contractName}`].bytecode;
        // const abi = JSONBig.parse(output.contracts[`:${contractName}`].interface);
        return new SolidityContract_1.default({
            jsonInterface: [],
            data: '',
            gas: this._defaultTXOptions.gas || undefined,
            gasPrice: this._defaultTXOptions.gasPrice || undefined
        }, this);
    }
    ;
    ContractFromABI(abi) {
        this._requireDefaultFromAddress();
        return new SolidityContract_1.default({
            jsonInterface: abi,
            gas: this._defaultTXOptions.gas || undefined,
            gasPrice: this._defaultTXOptions.gasPrice || undefined
        }, this);
    }
    transfer(to, from, value) {
        if (from === '') {
            from = this.defaultOptions.from;
        }
        return new Transaction_1.default({
            from,
            to,
            value,
            gas: this._defaultTXOptions.gas || undefined,
            gasPrice: this._defaultTXOptions.gasPrice || undefined
        }, false, undefined, this);
    }
    _requireDefaultFromAddress() {
        if (this._defaultTXOptions.from == null) {
            throw new Error('Set default `from` address. use `EVML.defaultFrom(<address>)`');
        }
    }
    ;
}
exports.default = Controller;
