"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors = require("./errors");
exports.requireArgsLength = function (expected, received) {
    if (expected !== received) {
        throw errors.InvalidNumberOfSolidityArgs(expected, received);
    }
    else {
        return true;
    }
};
exports.requireSolidityTypes = function (required, received) {
    if (typeof received !== parseSolidityType(required)) {
        throw errors.InvalidSolidityType();
    }
    else {
        return true;
    }
};
var parseSolidityType = function (type) {
    switch (type.toLowerCase()) {
        case 'address':
            return 'string';
    }
    if (type.toLowerCase().includes('int')) {
        return 'number';
    }
    return undefined;
};
