
const { createOpenAIFunctionsAgent, AgentExecutor } = require("langchain/agents");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { SerpAPI } = require("langchain/tools"); 

const {
  computeTotalHoldingsTool,
  computeTotalProfitLossTool,
  computeProfitLossPerStockTool,
} = require("./tools");

async function runAgent(user_id, userQuestion) {
  console.log(`🤖 Running Agent for user ${user_id}...`);
  console.log(`User Question: "${userQuestion}"`);

  const model = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0,
  });

  const tools = [
    computeTotalHoldingsTool,
    computeTotalProfitLossTool,
    computeProfitLossPerStockTool,
  ];

  const agent = await createOpenAIFunctionsAgent({
    llm: model,
    tools,
  });
  
  const executor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });

  const response = await executor.invoke({
    input: userQuestion,
    user_id, 
  });

  return response.output;
}

module.exports = {
  runAgent,
};
