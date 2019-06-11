class Test {
	public readonly hello: string;

	constructor(obj: { hello: string }) {
		for (const attr of Object.keys(obj)) {
			this[attr] = obj[attr];
		}

		console.log(obj.hello);
		console.log(this.hello);
	}
}

const hellodanu = new Test({
	hello: 'danu'
});
