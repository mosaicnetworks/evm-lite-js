"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function InvalidNumberOfSolidityArgs(expected, received) {
    return new Error("Expected " + expected + " but got " + received + " arguments.");
}
exports.InvalidNumberOfSolidityArgs = InvalidNumberOfSolidityArgs;
function InvalidSolidityType() {
    return new TypeError('Invalid argument type');
}
exports.InvalidSolidityType = InvalidSolidityType;
function InvalidDataFieldInOptions() {
    return new Error('`data` field must be specified before deploying contract.');
}
exports.InvalidDataFieldInOptions = InvalidDataFieldInOptions;
function ContractAddressFieldSetAndDeployed() {
    return new Error("Contract's address option is already set. " +
        'Please reset to undefined to deploy.');
}
exports.ContractAddressFieldSetAndDeployed = ContractAddressFieldSetAndDeployed;
