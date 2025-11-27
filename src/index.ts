//run pipleline and get result
import executeSqlAgent from "./llm/agents/executeSql";
import summaryAgent from "./llm/agents/summary";
import dotenv from "dotenv";

dotenv.config();

function getContentFromAgentRsponse(response: any) {
  return response.messages.at(-1)?.content;
}

async function main() {
  // Get question from command line argument
  const question = process.argv[2];
  
  if (!question) {
    console.error("Error: Please provide a question as a command line argument.");
    console.error("Usage: npm start \"Your question here\"");
    process.exit(1);
  }

  console.log("Running pipeline...");
  console.log(`Question: ${question}\n`);
  
  executeSqlAgent.invoke({ messages: [
    { role: "user", content: question }
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