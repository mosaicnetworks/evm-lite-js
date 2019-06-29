export default class Utils {
	public static cleanAddress(address: string) {
		address = Utils.trimHex(address);

		return `0x${address}`;
	}

	public static isEquivalentObjects(objectA: any, objectB: any) {
		const aProps = Object.getOwnPropertyNames(objectA);
		const bProps = Object.getOwnPropertyNames(objectB);

		if (aProps.length !== bProps.length) {
			return false;
		}

		for (const propName of aProps) {
			if (
				typeof objectA[propName] === 'object' &&
				typeof objectB[propName] === 'object'
			) {
				if (
					!Utils.isEquivalentObjects(
						objectA[propName],
						objectB[propName]
					)
				) {
					return false;
				}
			} else if (objectA[propName] !== objectB[propName]) {
				return false;
			}
		}

		return true;
	}

	public static trimHex(hex: string) {
		hex = hex.toLowerCase();

		while (hex.startsWith('0x')) {
			hex = `${hex.slice(2)}`;
		}

		return hex;
	}
}
