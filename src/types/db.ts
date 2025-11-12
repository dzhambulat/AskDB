export type TableSchema = {
    tableName: string,
    columns: string[]
}

export type QueryResult = Array<Array<any>>;

export interface IDatabaseProvider {
    connect(): Promise<void>;

    getSchema(): Promise<TableSchema>;

    query(sql: string): QueryResult;
}