declare module 'web3-eth-accounts' {
    export default class Accounts {
        public decrypt(v3JSONKeyStore: any, password: string): any;
        public create(): any;
    }
}