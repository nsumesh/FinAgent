const { DynamicStructuredTool } = require("langchain/tools");
const { z } = require("zod");
const { supabase } = require("../../lib/supabaseClient");

const loadPortfolioTool = new DynamicStructuredTool({
  name: "load_portfolio",
  description: "Load and return the user's stock portfolio from Supabase as a human-readable summary.",
  schema: z.object({
    user_id: z.string().describe("The Supabase user ID"),
  }),
  func: async ({ user_id }) => {
    const { data, error } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", user_id);

    if (error) throw new Error("Failed to fetch portfolio");

    if (!data || data.length === 0) {
      return "Your portfolio is currently empty.";
    }

    const summaryLines = data.map((stock) => {
      return `- ${stock.company_name} (${stock.ticker}): ${stock.quantity} shares @ $${stock.current_price.toFixed(2)} (bought at $${stock.value})`;
    });

    const summary = `
Here is your current portfolio:

${summaryLines.join("\n")}
`;

    return summary.trim();
  },
});

module.exports = { loadPortfolioTool };
