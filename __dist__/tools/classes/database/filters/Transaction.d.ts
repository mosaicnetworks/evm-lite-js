import { TransactionSchema } from "../Database";
import Filter from "../abstract/Filter";
export default class Transactions extends Filter<TransactionSchema> {
    constructor(transactions: TransactionSchema[]);
    sender(address: string): TransactionSchema[];
    receiver(address: string): TransactionSchema[];
}
