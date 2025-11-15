import { IDatabaseProvider, QueryResult } from "../types/db";
import { Pool, Query } from "pg"

export class NonInitException {

}
export default class PostgresSqlProvider implements IDatabaseProvider {
    pool?: Pool;
    async connect() {
        if (!this.pool) {
            this.pool = new Pool({
                connectionString: process.env.POSTGRES_URL,
            });
        }
    }

    async makeQuery<T>(query: string): Promise<QueryResult<T>> {
        if (!this.pool) {
            throw new NonInitException();
        }
        const table = await this.pool.query(query);

        const result: QueryResult<T> = table.rows;
        return Promise.resolve(result)
    }
}