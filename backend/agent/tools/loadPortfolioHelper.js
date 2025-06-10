require("dotenv").config({ path: "../../.env" });
const { createClient } = require("@supabase/supabase-js");
const axios = require("axios");

const { supabase } = require('../../lib/supabaseClient');

function mapSICtoSector(sicDesc) {
  if (!sicDesc) return "Unknown";
  const mappings = [
    { keyword: "Electronic", sector: "Technology" },
    { keyword: "Computer", sector: "Technology" },
    { keyword: "Pharmaceutical", sector: "Healthcare" },
    { keyword: "Electric", sector: "Utilities" },
    { keyword: "Petroleum", sector: "Energy" },
    { keyword: "Bank", sector: "Financial Services" },
    { keyword: "Retail", sector: "Consumer Discretionary" },
    { keyword: "Natural Gas", sector: "Energy" },
    { keyword: "Telephone", sector: "Communication Services" },
    { keyword: "Insurance", sector: "Financial Services" },
    { keyword: "Food", sector: "Consumer Staples" },
    { keyword: "Transportation", sector: "Industrials" },
  ];

  for (const { keyword, sector } of mappings) {
    if (sicDesc.toLowerCase().includes(keyword.toLowerCase())) {
      return sector;
    }
  }
  return "Unknown";
}
async function loadPortfolio(user_id) {
  try {
    const { data: rows, error } = await supabase
    .from("portfolios")    
    .select("ticker, quantity, value, company_name")  // include value!
    .eq("user_id", user_id);
  
  if (error) throw error;
  
  const portfolio = [];
  for (const row of rows) {
    const { ticker, quantity, value } = row;
    const purchase_price = quantity > 0 ? value / quantity : 0;
  
    // Fetch SIC Description → map to sector
    const overviewRes = await axios.get(
      `https://api.polygon.io/v3/reference/tickers/${ticker}`,
      {
        params: { apiKey: process.env.POLYGON_API_KEY }, // you were missing this reference!
      }
    );
  
    const sic_description =
      overviewRes.data?.results?.sic_description || "Unknown";
    const sector = mapSICtoSector(sic_description);
  
    console.log(`Fetched sector for ${ticker}: ${sector}`);
  
    portfolio.push({
      ticker,
      quantity,
      purchase_price,
      sector,
    });
  }
  return portfolio;
  
  } catch (err) {
    console.error("Error loading portfolio:", err.message);
    throw err;
  }
}
module.exports = { loadPortfolio };
