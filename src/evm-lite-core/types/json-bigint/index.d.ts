declare module 'json-bigint' {
    function parse<T>(data: string): T;
    function stringify<T>(obj: T): string;
}