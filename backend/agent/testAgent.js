require('dotenv').config({ path: '../.env' });
const { generatePortfolioInsights } = require('./portfolioAgent');

(async () => {
  console.log('Running test agent...');

  // Replace this with a real user_id from your Supabase table!
  const user_id = '9f90151b-0bcc-430d-afdc-dd917dd638e5';

  try {
    const insights = await generatePortfolioInsights(user_id);
    console.log('\nPortfolio Insights:\n');
    console.log(insights);
  } catch (err) {
    console.error('❌ Error running agent:', err.message);
  }
})();
