const fs = require('fs')
const solc = require('solc')
const JSONbig = require('json-bigint');

input = fs.readFileSync('./contract.sol')
output = solc.compile(input.toString(), 1)

console.log(JSONbig.stringify(output));