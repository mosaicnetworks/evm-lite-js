export default class Static {
    static exists(path: string): boolean;
    static isDirectory(path: string): boolean;
    static createDirectoryIfNotExists(path: string): void;
    static cleanAddress(address: string): string;
    static createOrReadFile(path: string, data: string): string;
    static isEquivalentObjects(objectA: any, objectB: any): boolean;
}
