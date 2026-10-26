const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

router.get('/stocks', marketController.getStocks);
router.get('/stocks/:symbol/quote', marketController.getQuote);
router.get('/stocks/:symbol/history', marketController.getHistory);

module.exports = router;
