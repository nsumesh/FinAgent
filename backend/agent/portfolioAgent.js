require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { RunnableSequence } = require('@langchain/core/runnables');
const { computeProfitLoss } = require('./math');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 🔸 Load portfolio once for all functions
async function loadPortfolio(user_id) {
  const { data: stocks, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', user_id);

  if (error) throw new Error('Failed to load portfolio');
  return stocks;
}

async function generatePortfolioInsights(user_id) {
  const stocks = await loadPortfolio(user_id);

  const stockSummaries = stocks.map((stock) => {
    const pl = computeProfitLoss(stock.value, stock.current_price, stock.quantity);
    const safePL = isNaN(pl) ? 0 : pl;
    return `${stock.company_name} (${stock.ticker}) — Bought at $${stock.value}, Quantity ${stock.quantity}, Current Price $${stock.current_price} → Profit/Loss: ${safePL >= 0 ? '+' : ''}$${safePL.toFixed(2)}`;
  });

  const totalPL = stocks.reduce((acc, stock) => {
    const pl = computeProfitLoss(stock.value, stock.current_price, stock.quantity);
    return acc + (isNaN(pl) ? 0 : pl);
  }, 0);

  const prompt = new PromptTemplate({
    template: `
You are a professional financial portfolio assistant.
You DO NOT say "as an AI." Speak naturally.

Analyze the following user stock portfolio:

{stock_summaries}

Overall profit/loss: ${totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)} USD.

For each stock:
- Go in detail about the performance.
- Recommend whether to hold / sell / buy more.

Then:
- Give 2-3 insights about the overall portfolio.
- Suggest 2-3 actions the user could take, such as suggesting buying different stocks, suggest those stocks as well.
- Base your recommendations off current news and quarterly performance.
- Keep your advice limited to only stocks right now.
- Talk about current market trends as well, and if suggesting sectors, suggest the companies in those sectors too.
    `,
    inputVariables: ['stock_summaries'],
  });

  const llm = new ChatOpenAI({
    temperature: 0.3,
    modelName: 'gpt-4',
  });

  const chain = RunnableSequence.from([prompt, llm]);

  const response = await chain.invoke({
    stock_summaries: stockSummaries.join('\n'),
  });

  return response.content;
}

async function generatePortfolioValueSummary(user_id) {
  const stocks = await loadPortfolio(user_id);

  const totalValue = stocks.reduce((acc, stock) => {
    return acc + stock.current_price * stock.quantity;
  }, 0);

  return `Your total portfolio value is approximately $${totalValue.toFixed(2)} USD.`;
}

async function generateStockSuggestions(user_id) {
  const prompt = new PromptTemplate({
    template: `
You are a professional stock advisor.
Suggest 2-3 stocks that the user could consider buying today.
Explain why for each, based on current trends and performance.

Output in plain text.
    `,
    inputVariables: [],
  });

  const llm = new ChatOpenAI({
    temperature: 0.4,
    modelName: 'gpt-4',
  });

  const chain = RunnableSequence.from([prompt, llm]);

  const response = await chain.invoke({});

  return response.content;
}

async function generateDiversificationAdvice(user_id) {
  const prompt = new PromptTemplate({
    template: `
You are a financial portfolio advisor.
The user is asking about diversification.

Suggest 2-3 sectors to consider adding to their portfolio.
For each sector, give 1-2 example stocks.

Explain your reasoning.
    `,
    inputVariables: [],
  });

  const llm = new ChatOpenAI({
    temperature: 0.4,
    modelName: 'gpt-4',
  });

  const chain = RunnableSequence.from([prompt, llm]);

  const response = await chain.invoke({});

  return response.content;
}

async function generateMarketTrendsSummary(user_id) {
  const prompt = new PromptTemplate({
    template: `
You are a market analyst.
Summarize the current stock market trends (US markets).

Include:
- 2-3 key trends (macro / sectoral)
- Notable news affecting markets
- Advice to retail investors right now
- In your response, don't say you're an Open AI model, just give a general outline
Output in plain text.
    `,
    inputVariables: [],
  });

  const llm = new ChatOpenAI({
    temperature: 0.4,
    modelName: 'gpt-4',
  });

  const chain = RunnableSequence.from([prompt, llm]);

  const response = await chain.invoke({});

  return response.content;
}

async function runPortfolioAgent(user_id, message) {
  console.log(`⚙️ runPortfolioAgent: "${message}"`);

  const lowerMessage = message.toLowerCase();

  const intentMap = [
    {
      keywords: ['recommend', 'suggest', 'buy'],
      handler: generateStockSuggestions,
    },
    {
      keywords: ['diversify', 'diversification'],
      handler: generateDiversificationAdvice,
    },
    {
      keywords: [
        'total value',
        'portfolio worth',
        'total portfolio value',
        'portfolio value',
        'how much is my portfolio',
        'portfolio valuation',
      ],
      handler: generatePortfolioValueSummary,
    },
    {
      keywords: ['market trends', 'market doing', 'current market'],
      handler: generateMarketTrendsSummary,
    },
  ];

  for (const intent of intentMap) {
    if (intent.keywords.some(keyword => lowerMessage.includes(keyword))) {
      console.log(`Running handler for intent: ${intent.handler.name} (matched keywords: ${intent.keywords.join(', ')})`);
      return await intent.handler(user_id);
    }
  }

  console.log('No intent match → running generatePortfolioInsights...');
  return await generatePortfolioInsights(user_id);
}

// Export all:
module.exports = {
  runPortfolioAgent,
  generatePortfolioInsights,
  generatePortfolioValueSummary,
  generateStockSuggestions,
  generateDiversificationAdvice,
  generateMarketTrendsSummary,
};