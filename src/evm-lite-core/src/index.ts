export { default as EVMLC } from './classes/EVMLC';
export { default as Account } from './classes/Account';
export { BaseAccount } from './client/AccountClient';

export {
	default as SolidityContract,
	BaseContractSchema
} from './classes/SolidityContract';

export {
	SentTX,
	SignedTransaction,
	default as Transaction
} from './classes/Transaction';

export { default as AddressType } from './types/lib/AddressType';
export * from './utils/Interfaces';
export { V3JSONKeyStore } from './classes/Account';
export { TXReceipt } from './client/TransactionClient';
