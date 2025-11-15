// llm agent which gets result from sql query and generate report

import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

const prompt = PromptTemplate.fromTemplate(
    "Using the result of the query, generate a summary of the data. " +
    "The result of the query is: {result} " +
    "The summary is: {summary}"
);

const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
});

const llmChain = RunnableSequence.from([prompt, model]);

export default llmChain;