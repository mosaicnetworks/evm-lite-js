export interface Input {
    name: string;
    type: string;
}
export interface ABI {
    constant?: any;
    inputs: Input[];
    name?: any;
    outputs?: any[];
    payable: any;
    stateMutability: any;
    type: any;
}
