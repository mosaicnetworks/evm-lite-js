import AddressType from './types/AddressType';
import ArrayType from './types/ArrayType';
import BooleanType from './types/BooleanType';
import ByteType from './types/ByteType';
import EVMType from './types/EVMType';
import StringType from './types/StringType';

import {TX} from "../classes/Transaction";

export {AddressType, ArrayType, BooleanType, ByteType, StringType, EVMType};

export * from './types/TransactionTypes'

export function parseSolidityTypes(raw: string) {
    switch (raw) {
        case 'bool':
            return new BooleanType();
        case 'address':
            return new AddressType('');
        case 'string':
            return new StringType();
        case 'byte':
            return new ByteType();
        case 'bytes':
            return new ArrayType(new ByteType());
    }
};

export function parseTransaction(tx: TX) {
    const parsedTX: any = {
        ...tx
    }

    if (tx.from && tx.from instanceof AddressType) {
        parsedTX.from = tx.from.value
    }

    if (tx.to && tx.to instanceof AddressType) {
        parsedTX.to = tx.to.value
    }

    return parsedTX;
}