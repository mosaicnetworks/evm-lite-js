import { AbstractClient } from 'evm-lite-client';
declare abstract class AbstractConsensus extends AbstractClient {
    protected constructor(host: string, port: number);
    abstract getBlock(index: number): Promise<any>;
    abstract getPeers(): Promise<any[]>;
}
export default AbstractConsensus;
