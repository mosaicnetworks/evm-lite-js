declare module 'solc' {

    interface CompiledContract {
        assembly: {};
        bytecode: string;
        functionHashes: {};
        gasEstimates: {
            creation: number[],
            external: {
                [key: string]: number | null
            },
            internal: {}
        };
        interface: any;
    }

    export interface CompilerOutput {
        contracts: {
            [key: string]: CompiledContract
        },
        errors: string[],
        sourceList: string[],
        sources: {}
    }

    export function compile(input: any, index: number): CompilerOutput;

}