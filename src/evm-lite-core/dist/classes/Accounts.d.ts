import AccountClient from '../client/AccountClient';
export default class Wallet extends AccountClient {
    constructor(host: string, port: number);
    add(): void;
    remove(): void;
    clear(): void;
    encrypt(): void;
}
