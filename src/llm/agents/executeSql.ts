import dotenv from "dotenv";
dotenv.config();

import { createAgent } from "langchain";
import { getSchemaTool} from "../tools/getSchema";
import { makeQueryTool } from "../tools/makeQuery";


// openai agent which uses tools from getSchema and makeQuery

const tools = [getSchemaTool, makeQueryTool];

if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set. Please add it to your .env file.");
}

const systemPrompt = "You are a helpful assistant that can execute SQL queries on a PostgreSQL database based on user human question. " +
    "Use tools to execute the query. " +
    "First you need to get the schema of the database and use the getSchema tool for it. Call it only once" +
    "Then if you need to execute a query based on the schema, use the makeQuery tool, pass the correct SQL query to it. Use table names and corresponding column names from the schema" +
    "Don't modify the database, use only SELECT queries. And make only one try and return the result as JSON. If you don't know the answer, say 'I don't know'." +
    "The result must be in the format of array of JSON objects, no any additional text";

const agent = createAgent({
    tools: tools,
    model: "gpt-4o-mini",
    systemPrompt: systemPrompt
});


export default agent;