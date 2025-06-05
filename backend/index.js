const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
require('dotenv').config();
console.log("🔐 Loaded POLYGON_API_KEY:", process.env.POLYGON_API_KEY);

// Search route
app.get('/api/search-tickers', async (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: 'Query is required' });
  
    try {
      const polygonRes = await axios.get(
        `https://api.polygon.io/v3/reference/tickers`,
        {
          params: {
            search: query,
            active: true,
            apiKey: process.env.POLYGON_API_KEY,
          },
        }
      );
  
      const results = polygonRes.data.results?.slice(0, 5) || []; // Limit to 5 suggestions
      const simplified = results.map((item) => ({
        name: item.name,
        ticker: item.ticker,
      }));
  
      res.json(simplified);
    } catch (err) {
      console.error('Polygon API error:', err.message);
      res.status(500).json({ error: 'Failed to fetch ticker data' });
    }
  });
  
const PORT = process.env.PORT || 5000;

console.log("Starting server...");

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
