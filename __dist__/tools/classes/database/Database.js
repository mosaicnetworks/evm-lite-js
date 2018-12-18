"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LowDB = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");
var path = require("path");
var Static_1 = require("../Static");
var Transaction_1 = require("./controllers/Transaction");
var Database = /** @class */ (function () {
    function Database(directory, name) {
        this.directory = directory;
        this.name = name;
        this.path = path.join(directory, name);
        if (Static_1.default.exists(this.path)) {
            this.database = LowDB(new FileSync(this.path));
        }
        else {
            var defaults = {
                transactions: []
            };
            this.database = LowDB(new FileSync(this.path));
            this.database.defaults(defaults).write();
        }
        this.transactions = new Transaction_1.default(this.database);
    }
    return Database;
}());
exports.default = Database;
