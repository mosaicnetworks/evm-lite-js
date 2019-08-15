import BN from 'bn.js';
import AbstractClient from './AbstractClient';
export interface IBaseAccount {
    readonly address: string;
    readonly nonce: number;
    readonly balance: BN | number;
    readonly bytecode: string;
}
export interface ILog {
    readonly topics: string[];
    readonly address: string;
    readonly data: string;
    readonly blockNumber: string;
    readonly transactionHash: string;
    readonly transactionIndex: string;
    readonly blockHash: string;
    readonly logIndex: string;
    readonly removed: boolean;
    readonly event?: string;
    readonly args: any;
}
export interface IReceipt {
    readonly root: string;
    readonly transactionHash: string;
    readonly from: string;
    readonly to?: string;
    readonly gasUsed: number;
    readonly cumulativeGasUsed: number;
    readonly contractAddress: string;
    readonly logs: ILog[];
    readonly logsBloom: string;
    readonly status: number;
}
export interface ISendTxResponse {
    readonly txHash: string;
}
export interface IInput {
    readonly name: string;
    readonly type: string;
}
export interface IABI {
    readonly constant?: any;
    readonly inputs: IInput[];
    readonly name: string;
    readonly outputs?: any[];
    readonly payable: any;
    readonly stateMutability: any;
    readonly type: any;
}
export declare type IContractABI = IABI[];
interface ICallTxResponse {
    data: string;
}
interface IPOAContract {
    readonly address: string;
    readonly abi: IContractABI;
}
declare class BaseEVMLC extends AbstractClient {
    protected constructor(host: string, port: number);
    getPOAContract(): Promise<IPOAContract>;
    getReceipt(txHash: string): Promise<IReceipt>;
    getAccount(address: string): Promise<IBaseAccount>;
    getInfo(): Promise<any>;
    protected callTx(tx: string): Promise<ICallTxResponse>;
    protected sendTx(signedTx: string): Promise<ISendTxResponse>;
}
export default BaseEVMLC;
