const { DynamicStructuredTool } = require("langchain/tools");
const { z } = require("zod");
const { loadPortfolio } = require("./loadPortfolioHelper");

const analyzePortfolioDiversificationTool = new DynamicStructuredTool({
  name: "analyze_portfolio_diversification",
  description: "Analyze the user's portfolio diversification by sector.",
  schema: z.object({
    user_id: z.string(),
  }),
  func: async ({ user_id }) => {
    try {
      const portfolio = await loadPortfolio(user_id);

      const sectorCounts = {};

      for (const item of portfolio) {
        const sector = item.sector || "Unknown";
        if (!sectorCounts[sector]) {
          sectorCounts[sector] = 0;
        }
        sectorCounts[sector] += 1;
      }

      console.log("Sector counts:", sectorCounts);

      return JSON.stringify({
        sector_breakdown: sectorCounts,
        notes:
          "Sectors with 0 stocks are underweight. Diversification is better when sectors are balanced.",
      });
    } catch (err) {
      console.error("Error in analyzePortfolioDiversificationTool:", err.message);
      return "Error analyzing portfolio diversification.";
    }
  },
});

module.exports = { analyzePortfolioDiversificationTool };
