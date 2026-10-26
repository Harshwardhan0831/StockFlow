const { generateStocks, getQuote, getHistory } = require('../services/mockDataService');

exports.getStocks = (req, res) => {
  const stocks = generateStocks();
  res.json({ stocks, count: stocks.length });
};

exports.getQuote = (req, res) => {
  res.json(getQuote(req.params.symbol));
};

exports.getHistory = (req, res) => {
  const days = parseInt(req.query.days, 10) || 30;
  res.json({ symbol: req.params.symbol, history: getHistory(req.params.symbol, days) });
};
