// llm agent which gets result from sql query and generate report

import dotenv from "dotenv";
dotenv.config();

import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { createAgent } from "langchain";

const prompt = 
    "Using the array of JSON objects, generate a summary of the data. Add human readable text to show the data and some table formatting if its required ";

if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set. Please add it to your .env file.");
}

const agent = createAgent({
    model: "gpt-4o-mini",
    systemPrompt: prompt
});


export default agent;