const { DynamicStructuredTool } = require("langchain/tools");
const axios = require("axios");
const { z } = require("zod");

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

const getCompanyName = async (ticker) => {
  try {
    const res = await axios.get(`https://api.polygon.io/v3/reference/tickers/${ticker}`, {
      params: {
        apiKey: POLYGON_API_KEY,
      },
    });
    return res.data?.results?.name || "Unknown Company";
  } catch (err) {
    console.error(`Error fetching company name for ${ticker}:`, err.response?.data || err.message);
    return "Unknown Company";
  }
};

const getMarketSummaryTool = new DynamicStructuredTool({
  name: "get_market_summary",
  description:
    "Fetch today's US stock market summary with close prices for all stocks. Useful for recommending stocks under a budget.",
  schema: z.object({}),
  func: async () => {
    const hardcodedDate = "2025-06-06";

    const url = `https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/${hardcodedDate}`;

    try {
      const res = await axios.get(url, {
        params: { apiKey: POLYGON_API_KEY },
      });

      const data = res.data?.results || [];

      const simplified = await Promise.all(
        data.map(async (item) => {
          const company_name = await getCompanyName(item.T);
          return {
            ticker: item.T,
            close_price: item.c,
            company_name,
          };
        })
      );

      const filtered = simplified.filter((item) => item.company_name !== "Unknown Company");

      console.log(`✅ Market summary fetched: ${filtered.length} tickers with known company names`);

      return JSON.stringify(filtered.slice(0, 2000));
    } catch (err) {
      console.error("Error fetching market summary:", err.response?.data || err.message);
      return "Error fetching market summary.";
    }
  },
});

module.exports = { getMarketSummaryTool };

