import { Babble } from 'evm-lite-consensus';

import Node from './Node';

class Monet extends Node<Babble> {
	constructor(host: string, port: number) {
		const babble = new Babble(host, port);

		super(host, port, babble);
	}
}

export default Monet;
