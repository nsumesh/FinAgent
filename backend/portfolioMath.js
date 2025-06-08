function computeTotalValue(portfolio) {
    return portfolio.reduce((sum, stock) => sum + (stock.quantity * stock.current_price), 0);
  }
  
  function computePL(stock) {
    return (stock.current_price - stock.value) * stock.quantity;
  }
  
  function computePortfolioPL(portfolio) {
    return portfolio.map(stock => ({
      ticker: stock.ticker,
      pl: computePL(stock)
    }));
  }
  
  function computeAllocations(portfolio) {
    const total = computeTotalValue(portfolio);
    return portfolio.map(stock => ({
      ticker: stock.ticker,
      allocationPct: ((stock.quantity * stock.current_price) / total) * 100
    }));
  }
  
  function computeTopGainers(portfolio, topN = 3) {
    return computePortfolioPL(portfolio)
      .sort((a, b) => b.pl - a.pl)
      .slice(0, topN);
  }
  
  function computeTopLosers(portfolio, topN = 3) {
    return computePortfolioPL(portfolio)
      .sort((a, b) => a.pl - b.pl)
      .slice(0, topN);
  }
  
  function computeStockPercentChange(stock) {
    return ((stock.current_price - stock.value) / stock.value) * 100;
  }
  
  module.exports = {
    computeTotalValue,
    computePL,
    computePortfolioPL,
    computeAllocations,
    computeTopGainers,
    computeTopLosers,
    computeStockPercentChange,
  };
  