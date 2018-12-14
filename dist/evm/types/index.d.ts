import AddressType from './types/AddressType';
import ArrayType from './types/ArrayType';
import BooleanType from './types/BooleanType';
import ByteType from './types/ByteType';
import EVMType from './types/EVMType';
import StringType from './types/StringType';
import { TX } from "../classes/Transaction";
export { AddressType, ArrayType, BooleanType, ByteType, StringType, EVMType };
export * from './types/TransactionTypes';
export declare function parseSolidityTypes(raw: string): AddressType | BooleanType | ByteType | StringType | ArrayType<ByteType> | undefined;
export declare function parseTransaction(tx: TX): any;
