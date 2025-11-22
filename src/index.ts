//run pipleline and get result
import executeSqlAgent from "./llm/agents/executeSql";
import summaryAgent from "./llm/agents/summary";
import dotenv from "dotenv";

dotenv.config();

function getContentFromAgentRsponse(response: any) {
  return response.messages.at(-1)?.content;
}

async function main() {
  console.log("Running pipeline...");
  executeSqlAgent.invoke({ messages: [
    { role: "user", content: "Get me 3 users with the payments with most amount of payments. Give me only name and email." }
  ]}).then((result) => {
    const content = getContentFromAgentRsponse(result);
    summaryAgent.invoke({ messages: [
      { role: "user", content: content }
    ]}).then((summary) => {
      console.log(getContentFromAgentRsponse(summary));
    });
  });
}


main();