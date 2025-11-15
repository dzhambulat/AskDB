export type QueryResult<T> = Array<T>;

export interface IDatabaseProvider {
    connect(): Promise<void>;

    makeQuery<T>(query: string): Promise<QueryResult<T>>;
}