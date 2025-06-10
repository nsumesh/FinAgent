const { DynamicStructuredTool } = require("langchain/tools");
const { z } = require("zod");
const axios = require("axios");

const fetchStockInfoTool = new DynamicStructuredTool({
  name: "fetch_stock_info",
  description: "Fetch information about a stock ticker (e.g. AAPL, MSFT, TSLA). Returns company name, current price, and daily change.",
  schema: z.object({
    ticker: z.string().describe("The stock ticker symbol (e.g. AAPL, MSFT)"),
  }),
  func: async ({ ticker }) => {
    try {
      const apiKey = process.env.POLYGON_API_KEY;

      // Example Polygon API endpoint — adjust as needed:
      const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${apiKey}`;

      const response = await axios.get(url);
      const result = response.data;

      if (!result || !result.results || result.results.length === 0) {
        return `No data found for ${ticker}.`;
      }

      const stockData = result.results[0];

      const message = `
Here is the latest information for **${ticker}**:

- Close Price: $${stockData.c.toFixed(2)}
- High: $${stockData.h.toFixed(2)}
- Low: $${stockData.l.toFixed(2)}
- Volume: ${stockData.v}

`;

      return message;
    } catch (err) {
      console.error("Error fetching stock info:", err.message);
      return `Failed to fetch stock info for ${ticker}.`;
    }
  },
});

module.exports = { fetchStockInfoTool };
