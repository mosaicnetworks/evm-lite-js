export default abstract class BaseFilter<Schema> {
    protected readonly objects: Schema[];
    protected constructor(objects: Schema[]);
}
