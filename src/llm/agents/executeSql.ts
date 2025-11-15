import { ChatOpenAI } from "@langchain/openai";
import getSchemaTool from "../tools/getSchema";
import makeQueryTool from "../tools/makeQuery";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
// openai agent which uses tools from getSchema and makeQuery

const tools = [getSchemaTool, makeQueryTool];

const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
});


const prompt = PromptTemplate.fromTemplate(
    "You are a helpful assistant that can execute SQL queries on a PostgreSQL database. " +
    "Use tools to execute the query. " +
    "If you need to get the schema of the database, use the getSchema tool. " +
    "If you need to execute a query, use the makeQuery tool. " +
    "Don't modify the database, use only SELECT queries." +
    "The user query is: {query} " +
    "The result of the query is: {result}"
);

const llmChain = RunnableSequence.from([prompt, model.bindTools(tools)]);

export default llmChain;