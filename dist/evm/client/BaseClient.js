"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
exports.request = function (options, tx) {
    return new Promise(function (resolve, reject) {
        var req = http.request(options, function (response) {
            var data = '';
            response.on('data', function (chunk) { return (data += chunk); });
            response.on('end', function () { return resolve(data); });
            response.on('error', function (err) { return reject(err); });
        });
        req.on('error', function (err) { return reject(err); });
        if (tx) {
            req.write(tx);
        }
        req.end();
    });
};
var BaseClient = /** @class */ (function () {
    function BaseClient(host, port) {
        this.host = host;
        this.port = port;
    }
    BaseClient.prototype.options = function (method, path) {
        return {
            host: this.host,
            port: this.port,
            method: method,
            path: path
        };
    };
    return BaseClient;
}());
exports.default = BaseClient;
