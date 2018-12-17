declare module 'web3-eth-accounts' {
    export interface KDFEncryption {
        ciphertext: string,
        ciperparams: {
            iv: string
        }
        cipher: string,
        kdf: string,
        kdfparams: {
            dklen: number,
            salt: string,
            n: number,
            r: number,
            p: number
        }
        mac: string
    }

    export interface V3JSONKeyStore {
        version: number,
        id: string,
        address: string,
        crypto: KDFEncryption,
    }

    export class Accounts {

        public decrypt(v3JSONKeyStore: V3JSONKeyStore, password: string): any;

        public create(entropy?: string): Account;

    }

    export class Account {
        public address: string;
        public privateKey: string;

        public sign(message: string): any;

        public encrypt(password: string): V3JSONKeyStore;

        public signTransaction(tx: any): any;
    }

}

