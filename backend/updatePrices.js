// updatePrices.js
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const POLYGON_API_URL = 'http://localhost:5001/api/current-price';

(async function updatePrices() {
  console.log('Starting price update...');

  const { data: portfolios, error } = await supabase
    .from('portfolios')
    .select('id, ticker');

  if (error) {
    console.error('Failed to fetch portfolios:', error);
    process.exit(1);
  }

  console.log(`Fetched ${portfolios.length} portfolios.`);

  for (const stock of portfolios) {
    try {
      console.log(`Updating ${stock.ticker}...`);

      const res = await axios.get(`${POLYGON_API_URL}?ticker=${stock.ticker}`);
      const current_price = res.data?.current_price;

      if (current_price !== undefined) {
        const { error: updateError } = await supabase
          .from('portfolios')
          .update({ current_price })
          .eq('id', stock.id);

        if (updateError) {
          console.error(`Failed to update ${stock.ticker}:`, updateError);
        } else {
          console.log(`Updated ${stock.ticker} → $${current_price}`);
        }
      } else {
        console.warn(`No current price for ${stock.ticker}, skipping.`);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

    } catch (err) {
      console.error(`Error fetching price for ${stock.ticker}:`, err.message);
    }
  }

  console.log('Price updated');
  process.exit(0);
})();
