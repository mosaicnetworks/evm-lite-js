import * as Utils from 'web3-utils';

import { Iban } from 'web3-eth-iban';

import { ParsedTransaction } from '../classes/transaction/Transaction';

export interface FormattedTransaction {
	from: string;
	to?: string;
	value?: string;
	data?: string;
	gas: string;
	gasPrice: string;
	nonce?: string;
	chainId?: string;
}

export default class Formatters {
	public static inputCallFormatter(txObject: ParsedTransaction) {
		const formatted = Formatters.txInputFormatter(txObject);

		if (txObject.from) {
			txObject.from = Formatters.inputAddressFormatter(txObject.from);
		}

		return formatted;
	}

	public static txInputFormatter(
		txObject: ParsedTransaction
	): FormattedTransaction {
		const formatted: FormattedTransaction = {
			from: txObject.from,
			gas: '',
			gasPrice: '',
			data: txObject.data || '0x'
		};

		if (txObject.to) {
			formatted.to = Formatters.inputAddressFormatter(txObject.to);
		}

		if (txObject.data && !Utils.isHex(txObject.data)) {
			throw new Error('The data field must be HEX encoded data.');
		}

		['gasPrice', 'gas', 'value', 'nonce', 'chainId']
			.filter(key => {
				return txObject[key] !== undefined;
			})
			.forEach(key => {
				// @ts-ignore
				formatted[key] = Utils.numberToHex(txObject[key]);
			});

		return formatted;
	}

	public static inputAddressFormatter(address: string) {
		const iban = new Iban(address);

		if (iban.isValid() && iban.isDirect()) {
			return iban.toAddress().toLowerCase();
		}

		if (Utils.isAddress(address)) {
			return `0x${address.toLowerCase().replace('0x', '')}`;
		}

		throw new Error(
			`Provided address "${address}" is invalid, the capitalization` +
				` checksum test failed, or its an indrect IBAN address which ` +
				`can't be converted.`
		);
	}
}
