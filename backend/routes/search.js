// backend/routes/search.js
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const POLYGON_API_KEY = process.env.ZeBx0jFC0T42EpV7wie8WdLp8yKlW903;

router.get('/search-tickers', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query' });

  try {
    const url = `https://api.polygon.io/v3/reference/tickers?search=${query}&active=true&apiKey=${POLYGON_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    res.json({ results: data.results?.slice(0, 10) || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch from Polygon' });
  }
});

module.exports = router;
