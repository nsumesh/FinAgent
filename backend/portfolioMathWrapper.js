const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getUserPortfolio(user_id) {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', user_id);

  if (error) {
    console.error('Error fetching user portfolio:', error);
    throw new Error('Failed to fetch portfolio');
  }

  return data.map(item => ({
    company_name: item.company_name,
    ticker: item.ticker,
    quantity: item.quantity,
    bought_at: item.bought_at,
    value: item.value,
    current_price: item.current_price
  }));
}

async function computePortfolioSummary(user_id) {
  const portfolio = await getUserPortfolio(user_id);

  let total_invested = 0;
  let current_value = 0;

  portfolio.forEach(stock => {
    const invested = stock.quantity * stock.value;
    const current = stock.quantity * stock.current_price;

    total_invested += invested;
    current_value += current;
  });

  const total_profit_loss = current_value - total_invested;
  const profit_loss_percent = (total_profit_loss / total_invested) * 100;

  return {
    total_invested: total_invested.toFixed(2),
    current_value: current_value.toFixed(2),
    total_profit_loss: total_profit_loss.toFixed(2),
    profit_loss_percent: profit_loss_percent.toFixed(2)
  };
}

module.exports = {
  getUserPortfolio,
  computePortfolioSummary
};
