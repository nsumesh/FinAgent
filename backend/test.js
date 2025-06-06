const axios = require('axios');

axios.get('http://localhost:5000/api/search-tickers?query=apple')
  .then(res => {
    console.log("✅ Response from backend:", res.data);
  })
  .catch(err => {
    console.error("❌ Error:", err.response?.data || err.message);
  });
