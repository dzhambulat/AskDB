import { IDatabaseProvider, QueryResult } from "../types/db";
import { Pool, Query } from "pg"

import dotenv from "dotenv";
dotenv.config();
export class NonInitException {

}
export default class PostgresSqlProvider implements IDatabaseProvider {
    pool?: Pool;
    async connect() {
        if (!this.pool) {
            const connectionString = process.env.POSTGRES_URL;
            if (!connectionString) {
                throw new Error("POSTGRES_URL environment variable is not set");
            }
            this.pool = new Pool({
                connectionString: connectionString,
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