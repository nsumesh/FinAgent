const { DynamicStructuredTool } = require("langchain/tools");
const { z } = require("zod");
const { loadPortfolio } = require("./loadPortfolioHelper");


const allSectors = [
    "Technology",
    "Healthcare",
    "Financial Services",
    "Consumer Staples",
    "Energy",
    "Industrials",
    "Utilities",
    "Communication Services",
    "Materials",
    "Real Estate",
    "Unknown",
  ];

  const analyzePortfolioDiversificationTool = new DynamicStructuredTool({
    name: "analyze_portfolio_diversification",
    description: "Analyze the diversification of the user's portfolio by sector.",
    schema: z.object({
      user_id: z.string().describe("Supabase user_id of the user."),
    }),
    func: async ({ user_id }) => {
      try {
        const portfolio = await loadPortfolio(user_id);
        const sectorCounts = {};
  
        for (const holding of portfolio) {
          const { sector } = holding;
          if (sector in sectorCounts) {
            sectorCounts[sector] += 1;
          } else {
            sectorCounts[sector] = 1;
          }
        }
  
        console.log("Sector counts:", sectorCounts);
        const missingSectors = allSectors.filter(
          (sector) => !(sector in sectorCounts) || sectorCounts[sector] === 0
        );
        return {
          sector_breakdown: sectorCounts,
          missing_sectors: missingSectors,
          notes:
            "Sectors with 0 stocks are underweight. Diversification is better when sectors are balanced.",
        };
      } catch (err) {
        console.error("Error in analyzePortfolioDiversificationTool:", err.message);
        return "Error analyzing portfolio diversification.";
      }
    },
  });
  
  module.exports = { analyzePortfolioDiversificationTool };
  