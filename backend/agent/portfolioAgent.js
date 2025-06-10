require("dotenv").config({ path: "../.env" });

const { supabase } = require("../lib/supabaseClient");
const { ChatOpenAI } = require("@langchain/openai");
const { initializeAgentExecutorWithOptions } = require("langchain/agents");

const { loadPortfolioTool } = require("./tools/loadPortfolioTool");
const { computeProfitLossTool } = require("./tools/computeProfitLossTool");
const { fetchStockInfoTool } = require("./tools/fetchStockInfoTool");
const { getMarketSummaryTool } = require("./tools/getMarketSummaryTool");
const { analyzePortfolioDiversificationTool } = require("./tools/analyzePortfolioDiversificationTool");

async function loadChatHistory(user_id) {
  const { data: rows, error } = await supabase
    .from("chat_history")
    .select("role, content")
    .eq("user_id", user_id)
    .order("message_index", { ascending: true });

  if (error) {
    console.error("Error loading chat history:", error);
    return [];
  }

  return rows.map((row) => ({
    role: row.role,
    content: row.content,
  }));
}

async function saveChatMessages(user_id, userMessage, assistantResponse) {
  const { count, error: countError } = await supabase
    .from("chat_history")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user_id);

  if (countError) {
    console.error("Error counting chat history:", countError);
    return;
  }

  const nextIndex = count;

  const { error: insertError } = await supabase.from("chat_history").insert([
    {
      user_id: user_id,
      message_index: nextIndex,
      role: "user",
      content: userMessage,
    },
    {
      user_id: user_id,
      message_index: nextIndex + 1,
      role: "assistant",
      content: assistantResponse,
    },
  ]);

  if (insertError) {
    console.error("Error saving chat messages:", insertError);
  }
}

async function runPortfolioAgent(user_id, userMessage) {
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0,
  });

  const tools = [
    loadPortfolioTool,
    computeProfitLossTool,
    fetchStockInfoTool,
    getMarketSummaryTool,
    analyzePortfolioDiversificationTool,
  ];

  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "openai-functions",
    verbose: true,
    agentArgs: {
      systemMessage: `
You are a financial portfolio assistant.

Context:
- The variable user_id is provided to you as user_id = "${user_id}".
- When calling analyzePortfolioDiversificationTool, ALWAYS pass user_id=user_id in the tool arguments.

Behavior:

- If the user asks to "load", "show", "display", or "summarize" their portfolio or holdings → use ONLY loadPortfolioTool. Return the list of holdings in a readable format. DO NOT call computeProfitLossTool unless explicitly asked.

- When using loadPortfolioTool, ALWAYS pass user_id=user_id as argument. Do NOT ask the user for user_id.

- If the user asks explicitly about profit, gain, loss, return, or uses phrases such as:
    - "What is my total profit"
    - "How much did I make"
    - "How much did I lose"
    - "What is my return"
    - "Compute my profit or loss"
    → THEN IMMEDIATELY call computeProfitLossTool. Do not ask for confirmation.

- If the user asks vague phrases like "How am I doing", "Show my performance", "Show my results", "Am I making money", first load the portfolio, then ask user if they want to compute profit/loss.

- If the user asks about a specific stock ticker (e.g. "Tell me about AAPL", "What is the price of TSLA", "Give me info about MSFT"), you must use fetchStockInfoTool FIRST. Do not call loadPortfolioTool for this query. Only use fetchStockInfoTool.

- If the user message mentions both portfolio and specific stock (example: "Show me my portfolio and tell me about AAPL"), prioritize calling loadPortfolioTool first, then fetchStockInfoTool after.

- If the user asks for "recommend stocks", "what stocks should I add", "suggest stocks", "help me diversify", "give me good stocks to invest in", or similar:
    - First call loadPortfolioTool to retrieve the user's current holdings.
    - DO NOT suggest stocks already present in the user's portfolio.
    - After loading the portfolio, recommend 3-5 stocks based on your general knowledge of sectors and companies.
    - The recommendations should aim for diversification — suggest stocks from sectors the user is not heavily invested in.
    - DO NOT call any other tools after loadPortfolioTool (such as fetchStockInfoTool or computeProfitLossTool).
    - Example format of response:
        - AAPL (Technology)
        - JNJ (Healthcare)
        - XOM (Energy)
        - V (Financial Services)
        - COST (Consumer Staples)
    - Clearly label which sector each suggested stock belongs to.
    - You do NOT need to provide current prices or market performance.
    - Be helpful and thoughtful in your recommendation rationale — mention that you're recommending based on the user's existing portfolio and sectors not yet covered.

- If the user asks about a daily market summary with phrases like "What's today's market summary", call getMarketSummaryTool and summarize the output received in 3-4 sentences.

- If the user asks to "recommend stocks under $X", "suggest stocks within budget", "give me good stocks below $X", "recommend cheap stocks", etc.:

    → First call loadPortfolioTool to retrieve user's current holdings.

    → Then call getMarketSummaryTool to get today's market prices.

    → Filter the results to:
        - Only stocks where close_price ≤ budget
        - Stocks that the user does NOT already own.

    → Recommend 3-5 such stocks, with ticker and price, e.g.:

        - KO ($62.13) - Consumer Staples
        - WFC ($44.10) - Financials
        - XOM ($99.45) - Energy

    → Clearly state these were selected under the budget provided.

    → DO NOT call fetchStockInfoTool for these — use prices from getMarketSummaryTool.

    → If no suitable stocks are found, politely inform the user.

If the user asks "Am I diversified?", "Should I diversify?", "How can I diversify?", or similar:

    → Call analyzePortfolioDiversificationTool.

    → ALWAYS pass user_id=user_id.

    → When calling analyzePortfolioDiversificationTool, ALWAYS pass user_id=user_id as argument.

    → After receiving sector_breakdown:

        → Explain the sector breakdown clearly.

        → Identify sectors that have 0 stocks or are underweight.

        → For each underweight or missing sector:

            → Recommend 3–5 well-known example stocks from that sector.

            → Example format:
                - Healthcare: JNJ, PFE, MRK
                - Financials: JPM, BAC, GS
                - Consumer Staples: PG, KO, COST
                - Energy: XOM, CVX, SLB
                - Industrials: UNP, HON, GE

        → You do NOT need to call additional tools or fetch live prices.

        → You may use your general market knowledge.

        → Present the suggestions clearly so the user can act on them.

        → End with a helpful statement like:
          "These are example stocks you can explore to improve diversification."

Summary: Be precise in using tools based on intent. Do not mix tool calls unnecessarily.
      `,
    },
  });


  console.log("Agent initialized. Running...");

  const chat_history = await loadChatHistory(user_id);

  const response = await executor.invoke({
    input: `My user_id is ${user_id}. ${userMessage}`,
    chat_history: chat_history,
  });

  console.log("Agent response:", response);

  await saveChatMessages(user_id, userMessage, response.output);

  return response.output;
}

module.exports = { runPortfolioAgent };
