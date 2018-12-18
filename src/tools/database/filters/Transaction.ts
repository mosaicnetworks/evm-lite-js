import {TransactionSchema} from "../Database";

import Static from "../../classes/Static";
import Filter from "../abstract/Filter";


export default class Transactions extends Filter<TransactionSchema> {

    constructor(transactions: TransactionSchema[]) {
        super(transactions);
    }

    public sender(address: string): TransactionSchema[] {
        return this.objects.filter((transaction) => {
            return Static.cleanAddress(transaction.from) === Static.cleanAddress(address)
        })
    }

    public receiver(address: string): TransactionSchema[] {
        return this.objects.filter((transaction) => {
            return Static.cleanAddress(transaction.to) === Static.cleanAddress(address)
        })
    }

}
