// index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const { runPortfolioAgent } = require('./agent/portfolioAgent');

const app = express();
app.use(cors());
app.use(express.json());

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/api/search-tickers', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    console.log(`Searching tickers for query: "${query}"`);

    const polygonRes = await axios.get(
      'https://api.polygon.io/v3/reference/tickers',
      {
        params: {
          market: 'stocks',
          search: query,
          active: 'true',
          order: 'asc',
          limit: 100,
          sort: 'ticker',
          apiKey: POLYGON_API_KEY,
        },
      }
    );

    const results = polygonRes.data.results?.slice(0, 5) || [];
    const simplified = results.map((item) => ({
      name: item.name,
      ticker: item.ticker,
    }));

    console.log(` Returning ${simplified.length} results`);
    res.json(simplified);
  } catch (err) {
    console.error('Polygon API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch ticker data' });
  }
});

const dayjs = require('dayjs');

app.get('/api/current-price', async (req, res) => {
  const ticker = req.query.ticker;
  const dateParam = req.query.date;

  if (!ticker) return res.status(400).json({ error: 'Ticker is required' });

  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  const dateToUse = dateParam || yesterday;

  console.log(`Fetching historical close price for: ${ticker} on ${dateToUse}`);

  try {
    const polygonRes = await axios.get(
      `https://api.polygon.io/v1/open-close/${ticker}/${dateToUse}`,
      {
        params: {
          apiKey: POLYGON_API_KEY,
        },
      }
    );

    const price = polygonRes.data?.close;
    if (price === undefined) throw new Error('No close price available');

    console.log(`Historical close price for ${ticker} on ${dateToUse}: $${price}`);

    res.json({
      ticker,
      date: dateToUse,
      current_price: price,
      source: 'historical close',
    });
  } catch (err) {
    console.error('Polygon API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch current price' });
  }
});

app.post("/api/chat-agent", async (req, res) => {
  const { user_id, message } = req.body;
  if (!user_id || !message) return res.status(400).json({ error: "Missing fields" });

  try {
    const reply = await runPortfolioAgent(user_id, message);
    res.json({ reply });
  } catch (err) {
    console.error("Agent error:", err);
    res.status(500).json({ error: "Agent failed to respond" });
  }
});



const PORT = process.env.PORT || 5001;
console.log('Starting server...');

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});