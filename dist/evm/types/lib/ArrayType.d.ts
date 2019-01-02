import EVMType from './EVMType';
export default class ArrayType<T extends EVMType> extends EVMType {
    readonly item: T;
    readonly size?: number | undefined;
    constructor(item: T, size?: number | undefined);
}
