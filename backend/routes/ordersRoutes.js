const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const ordersController = require('../controllers/ordersController');

router.post('/place', authenticateToken, ordersController.placeOrder);
router.get('/', authenticateToken, ordersController.getOrders);
router.delete('/', authenticateToken, ordersController.resetOrders);

module.exports = router;
