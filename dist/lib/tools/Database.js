"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const JSONBig = require("json-bigint");
const DataDirectory_1 = require("./DataDirectory");
const Transactions_1 = require("./Transactions");
class Database {
    constructor(path) {
        this.path = path;
        this.data = JSONBig.parse(DataDirectory_1.default.createOrReadFile(path, JSONBig.stringify(Database.initial())));
        this.transactions = new Transactions_1.default(this.path, this.data.transactions);
    }
    static initial() {
        return {
            transactions: [],
        };
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                this.data.transactions = this.transactions.all();
                fs.writeFile(this.path, JSONBig.stringify(this.data), (err) => resolve(!err));
            });
        });
    }
}
exports.default = Database;
