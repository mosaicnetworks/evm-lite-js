"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AddressType_1 = require("./lib/AddressType");
exports.AddressType = AddressType_1.default;
var ArrayType_1 = require("./lib/ArrayType");
exports.ArrayType = ArrayType_1.default;
var BooleanType_1 = require("./lib/BooleanType");
exports.BooleanType = BooleanType_1.default;
var ByteType_1 = require("./lib/ByteType");
exports.ByteType = ByteType_1.default;
var EVMType_1 = require("./lib/EVMType");
exports.EVMType = EVMType_1.default;
var StringType_1 = require("./lib/StringType");
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
