const { DynamicTool } = require('langchain/tools');
const {
  getUserPortfolio,
  computePortfolioSummary
} = require('./portfolioMathToolWrapper');

const getUserPortfolioTool = new DynamicTool({
  name: 'get_user_portfolio',
  description: 'Get full portfolio holdings for a given user_id',
  func: async (user_id) => {
    const result = await getUserPortfolio(user_id);
    return JSON.stringify(result);
  }
});

const computePortfolioSummaryTool = new DynamicTool({
  name: 'compute_portfolio_summary',
  description: 'Compute total value and profit/loss for a user_id',
  func: async (user_id) => {
    const result = await computePortfolioSummary(user_id);
    return JSON.stringify(result);
  }
});

module.exports = {
  getUserPortfolioTool,
  computePortfolioSummaryTool
};
