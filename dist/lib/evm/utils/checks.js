"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors = require("./errors");
exports.requireArgsLength = (expected, received) => {
    if (expected !== received) {
        throw errors.InvalidNumberOfSolidityArgs(expected, received);
    }
    else {
        return true;
    }
};
exports.requireSolidityTypes = (required, received) => {
    if (typeof received !== parseSolidityType(required)) {
        throw errors.InvalidSolidityType();
    }
    else {
        return true;
    }
};
const parseSolidityType = (type) => {
    switch (type.toLowerCase()) {
        case 'address':
            return 'string';
    }
    if (type.toLowerCase().includes('int')) {
        return 'number';
    }
    return undefined;
};
