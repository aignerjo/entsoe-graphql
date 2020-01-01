export interface IDataLoader<K, V> {
    load(context: K): Promise<V>;
}
