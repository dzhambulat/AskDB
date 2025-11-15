import { Tool } from "@langchain/core/tools";
import PostgresSqlProvider from "../../db/postgressql";

class MakeQueryTool extends Tool {
    name = "make_query";
    description = "Executes a SQL query on PostgreSQL and returns result as JSON.";
    constructor(private readonly sqlProvider: PostgresSqlProvider) {
        super({});
    }

    async _call(query: string) {
        return await makeQuery(this.sqlProvider, query);
    }
}
async function makeQuery(sqlProvider: PostgresSqlProvider, query: string) {
    const result = await sqlProvider.makeQuery<any>(query);
    return JSON.stringify(result.map((row: any) => row.toJSON()));
}

export default new MakeQueryTool(new PostgresSqlProvider());