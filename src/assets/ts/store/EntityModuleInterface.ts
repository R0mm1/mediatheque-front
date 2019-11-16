export default interface EntityModuleInterface<T> {

    get(id: Number): Promise<T | undefined>;

    set(entity: T): void;

    save(): Promise<T | boolean>;
}
