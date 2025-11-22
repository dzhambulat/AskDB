import { IDatabaseProvider } from "../../types/db";
import { tool, createAgent } from "langchain";

import PostgresSqlProvider from "../../db/postgressql";


const sqlProvider = new PostgresSqlProvider();
sqlProvider.connect();

export const makeQueryTool = tool(
    (query: string) => {
        return makeQuery(sqlProvider, query);
    },
    {
        name: "makeQuery",
        description: "makes an SQL query to the database and returns the result as JSON",
    }
);

async function makeQuery(sqlProvider: PostgresSqlProvider, query: string) {
    const result = await sqlProvider.makeQuery<any>(query);
    return JSON.stringify(result.map((row: any) => JSON.stringify(row)));
}
