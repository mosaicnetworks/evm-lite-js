import EVMType from "./EVMType";
export default class AddressType extends EVMType {
    readonly value: string;
    constructor(value: string);
}
