"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var AddressType_1 = require("./types/AddressType");
exports.AddressType = AddressType_1.default;
var ArrayType_1 = require("./types/ArrayType");
exports.ArrayType = ArrayType_1.default;
var BooleanType_1 = require("./types/BooleanType");
exports.BooleanType = BooleanType_1.default;
var ByteType_1 = require("./types/ByteType");
exports.ByteType = ByteType_1.default;
var EVMType_1 = require("./types/EVMType");
exports.EVMType = EVMType_1.default;
var StringType_1 = require("./types/StringType");
exports.StringType = StringType_1.default;
function parseSolidityTypes(raw) {
    switch (raw) {
        case 'bool':
            return new BooleanType_1.default();
        case 'address':
            return new AddressType_1.default('');
        case 'string':
            return new StringType_1.default();
        case 'byte':
            return new ByteType_1.default();
        case 'bytes':
            return new ArrayType_1.default(new ByteType_1.default());
    }
}
exports.parseSolidityTypes = parseSolidityTypes;
;
function parseTransaction(tx) {
    return __assign({}, tx, { from: tx.from.value, to: tx.to && tx.to.value });
}
exports.parseTransaction = parseTransaction;
