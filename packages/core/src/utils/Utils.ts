export default class Static {
	public static cleanAddress(address: string) {
		address = address.toLowerCase();

		if (!address.startsWith('0x')) {
			return '0x' + address;
		}

		return address;
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
					!Static.isEquivalentObjects(
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
}
