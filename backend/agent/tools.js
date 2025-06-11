// agent/tools.js

const { DynamicTool } = require("langchain/tools");
const { totalHoldings, totalProfitLoss, profitLossPerStock } = require("./math");
const { supabase } = require("../lib/supabaseClient");

async function loadPortfolio(user_id) {
  const { data: stocks, error } = await supabase
    .from("portfolios")
    .select("*")
    .eq("user_id", user_id);

  if (error) throw new Error("Failed to load portfolio");

  return stocks;
}

const computeTotalHoldingsTool = new DynamicTool({
  name: "compute_total_holdings",
  description: "Compute the total value of the user's portfolio holdings",
  func: async (user_id) => {
    const portfolio = await loadPortfolio(user_id);
    const total = totalHoldings(portfolio);
    return `Total holdings value: $${total.toFixed(2)}`;
  },
});

const computeTotalProfitLossTool = new DynamicTool({
  name: "compute_total_profit_loss",
  description: "Compute the total profit or loss of the user's portfolio",
  func: async (user_id) => {
    const portfolio = await loadPortfolio(user_id);
    const total = totalProfitLoss(portfolio);
    const sign = total >= 0 ? "+" : "-";
    return `Total P/L: ${sign}$${Math.abs(total).toFixed(2)}`;
  },
});

const computeProfitLossPerStockTool = new DynamicTool({
  name: "compute_profit_loss_per_stock",
  description: "Compute profit or loss for each stock in the user's portfolio",
  func: async (user_id) => {
    const portfolio = await loadPortfolio(user_id);
    const results = profitLossPerStock(portfolio);

    return results
      .map((stock) => {
        const sign = stock.profit_loss >= 0 ? "+" : "-";
        return `${stock.company_name} (${stock.ticker}): ${sign}$${Math.abs(stock.profit_loss)}`;
      })
      .join("\n");
  },
});

module.exports = {
  computeTotalHoldingsTool,
  computeTotalProfitLossTool,
  computeProfitLossPerStockTool,
};
