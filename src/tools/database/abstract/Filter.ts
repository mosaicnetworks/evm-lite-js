export default abstract class BaseFilter<Schema> {

	protected constructor(protected readonly objects: Schema[]) {
	}

}
