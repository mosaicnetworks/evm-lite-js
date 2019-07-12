const path = require("path");

// import required objects
const { EVMLC, Contract } = require("evm-lite-core");

// account address
const address = "0x07BA865451D9417714E8Bb89e715ACBc789A1Bb7";
const password = "asdasd";
const defaultGas = 10000000;
const defaultGasPrice = 0;

// compile function
const compile = require("./compile");

// host and port of the running node
// the port should be the `service` port described in EVM-Lite
// client to node
const node = new EVMLC("127.0.0.1", 8080);

// compile contract
// const compiled = compile(path.join(__dirname, "contract.sol"), "CrowdFunding");
const compiled = {
  bytecode:
    "608060405234801561001057600080fd5b506040516104703803806104708339818101604052602081101561003357600080fd5b810190808051906020019092919050505060405180608001604052803373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020016000815260200160008152506000808201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506020820151816001015560408201518160020155606082015181600301559050505061037a806100f66000396000f3fe6080604052600436106100345760003560e01c806301cb3b201461003957806311da60b4146100a9578063d7bb99ba146100b3575b600080fd5b34801561004557600080fd5b5061004e6100bd565b60405180851515151581526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182815260200194505050505060405180910390f35b6100b161015d565b005b6100bb61026d565b005b60008060008060006001015460006003015410156101185760008060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166000600101546000600301548292509350935093509350610157565b60016000800160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660006001015460006003015482925093509350935093505b90919293565b6000600101546000600301541061022e57600080600301549050600080600301819055506000800160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501580156101eb573d6000803e3d6000fd5b507f09af12d5b97e0b3db4b2467182ec45bb12cae9cf8942cf8cf4a34b0fbb2cb3786001604051808215151515815260200191505060405180910390a15061026b565b7f09af12d5b97e0b3db4b2467182ec45bb12cae9cf8942cf8cf4a34b0fbb2cb3786000604051808215151515815260200191505060405180910390a15b565b346000600301600082825401925050819055507f567b97209529fbb11a50c435abb5bfdae05a969880bb35a24afc52d1f383af806000800160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff163334604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a156fea265627a7a72305820948592a7a280adfa4ad768c5d7619c89339a6e48424226c31c6cb05e6be5260964736f6c634300050a0032",
  abi: JSON.parse(
    '[{"constant":true,"inputs":[],"name":"checkGoalReached","outputs":[{"name":"reached","type":"bool"},{"name":"beneficiary","type":"address"},{"name":"goal","type":"uint256"},{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"settle","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"contribute","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[{"name":"goal","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"beneficiary","type":"address"},{"indexed":false,"name":"funder","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"NewContribution","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"ok","type":"bool"}],"name":"Settlement","type":"event"}]'
  )
};

// Generate contract abstraction object
const contract = Contract.create(compiled.abi, compiled.bytecode);

// import keystore and datadirectory objects
const { Keystore } = require("evm-lite-keystore");
const { DataDirectory } = require("evm-lite-datadir");

// initialize classes
const datadirPath = "/Users/danu/.evmlc";
const datadir = new DataDirectory(datadirPath);

// for `evmlc` keystore directory is a child of datadir
const keystore = new Keystore(path.join(datadirPath, "keystore"));

// set the keystore object as the keystore for datadir object
datadir.setKeystore(keystore);

// get account by address and decrypt with pass
const getAccount = async (address, password) => {
  // wait for keyfile to resolve
  const keyfile = await datadir.keystore.get(address);

  // return the decrypted account
  return Keystore.decrypt(keyfile, password);
};

const deployContract = async (account, goal) => {
  // generate deploy transaction
  const deployTransaction = contract.deployTransaction(
    [goal],
    account.address,
    defaultGas,
    defaultGasPrice
  );

  // wait for deployment and return receipt
  return await node.sendTransaction(deployTransaction, account);
};

const run = async () => {
  // fetch account and decrypt
  const account = await getAccount(address, password);

  // deploy contract with a goal of 1000
  const receipt = await deployContract(account, 1000);

  // populate contract functions and set contract address
  contract.setAddressAndAddFunctions(receipt.contractAddress);

  // now we can interact with the contract through
  // contribute 1001 to crowdFunding
  const contributeTransaction = contract.methods.contribute({
    from: account.address,
    gas: defaultGas,
    gasPrice: defaultGasPrice,
    value: 1001
  });

  // submit to node and get receipt
  const contributeReceipt = await node.sendTransaction(
    contributeTransaction,
    account
  );

  // logs are automatically parsed from the receipt
  console.log(
    "Contributed: ",
    contributeReceipt.logs[0].args.amount.toNumber()
  );

  // check if goal reached
  // notice no from address is needed as its a `view` transaction
  const checkGoalTransaction = contract.methods.checkGoalReached({
    gas: defaultGas,
    gasPrice: defaultGasPrice
  });

  const checkGoalResponse = await node.callTransaction(checkGoalTransaction);

  console.log("Goal Reached: ", checkGoalResponse[0]);

  // generate transaction to settle amount to beneficiary
  // from address is needed as this is a payable transaction
  const settleTransaction = contract.methods.settle({
    from: account.address,
    gas: defaultGas,
    gasPrice: defaultGasPrice
  });

  // send settle transaction
  const settleReceipt = await node.sendTransaction(settleTransaction, account);

  // logs are automatically parsed from the receipt
  console.log(settleReceipt.logs[0].args.ok);

  return "done";
};

run()
  .then(console.log)
  .catch(console.log);
