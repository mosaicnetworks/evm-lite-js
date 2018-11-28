export interface BaseTX {
    gas?: number,
    gasPrice?: number,
}

export interface BaseAccount {
    address: string,
    nonce: number,
    balance: any
}

export interface TX extends BaseTX {
    from: string,
    to?: string,
    value?: number,
    data?: string
}

export interface ContractOptions extends BaseTX {
    from?: string,
    address?: string,
    data?: string,
    jsonInterface: ABI[]
}

export interface Input {
    name: string,
    type: string,
}

export interface ABI {
    constant?: any,
    inputs: Input[],
    name?: any,
    outputs?: any[],
    payable: any,
    stateMutability: any,
    type: any
}

export interface TXReceipt {
    root: string,
    transactionHash: string,
    from: string,
    to?: string,
    gasUsed: number,
    cumulativeGasUsed: number,
    contractAddress: string,
    logs: [],
    logsBloom: string,
    status: number
}

export interface SolidityCompilerOutput {
    contracts: {},
    errors: string[],
    sourceList: string[],
    sources: {}
}

export interface Web3Account {
    address: string,
    privateKey: string,
    sign: (data: string) => any,
    encrypt: (password: string) => V3JSONKeyStore,
    signTransaction: (tx: string) => any,
}

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

export interface SentTx {
    from: string,
    to: string,
    value: number,
    gas: number,
    nonce: number,
    gasPrice: number,
    date: any,
    txHash: string
}