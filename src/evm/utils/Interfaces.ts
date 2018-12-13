export interface BaseTX {
    gas?: number,
    gasPrice?: string,
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

export interface SentTX {
    from: string,
    to: string,
    value: number,
    gas: number,
    nonce: number,
    gasPrice: number,
    date: any,
    txHash: string
}