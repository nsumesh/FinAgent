const { DynamicStructuredTool } = require("langchain/tools");
const { z } = require("zod");

const computeProfitLossTool = new DynamicStructuredTool({
  name: "compute_profit_loss",
  description: "Compute the total profit or loss for the given portfolio.",
  schema: z.object({
    portfolio: z.string().describe("JSON stringified array of {ticker, shares, current_price, purchase_price}"),
  }),
  func: async ({ portfolio }) => {
    try {
      const portfolioArray = JSON.parse(portfolio); 
      let totalProfitLoss = 0;

      portfolioArray.forEach((stock) => {
        const profitLossPerStock = (stock.current_price - stock.purchase_price) * stock.shares;
        totalProfitLoss += profitLossPerStock;
      });

      const result = totalProfitLoss >= 0
        ? `Your total profit is $${totalProfitLoss.toFixed(2)}.`
        : `Your total loss is $${Math.abs(totalProfitLoss.toFixed(2))}.`;

      return result;
    } catch (err) {
      return "Error parsing portfolio data.";
    }
  },
});

module.exports = { computeProfitLossTool };
