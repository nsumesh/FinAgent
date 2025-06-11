
function totalHoldings(portfolio) {
    return portfolio.reduce((acc, stock) => {
      return acc + stock.current_price * stock.quantity;
    }, 0);
  }
  
  function totalProfitLoss(portfolio) {
    return portfolio.reduce((acc, stock) => {
      const profitLoss = (stock.current_price - stock.value) * stock.quantity;
      return acc + profitLoss;
    }, 0);
  }
  
  function profitLossPerStock(portfolio) {
    return portfolio.map((stock) => {
      const profitLoss = (stock.current_price - stock.value) * stock.quantity;
      return {
        company_name: stock.company_name,
        ticker: stock.ticker,
        profit_loss: profitLoss.toFixed(2),
      };
    });
  }

  // utils/math.js

function computeProfitLoss(value, quantity, current_price) {
    const totalCost = value * quantity;
    const currentValue = current_price * quantity;
    const profitLoss = currentValue - totalCost;

    return {
        profitLoss,
        totalCost,
        currentValue,
    };
}


  
  module.exports = {
    computeProfitLoss,
    totalHoldings,
    totalProfitLoss,
    profitLossPerStock,
  };
  