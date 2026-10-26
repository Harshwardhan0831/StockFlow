const express = require('express');
const router = express.Router();
router.use('/auth', require('./authRoutes'));
router.use('/oauth', require('./oauthRoutes'));
router.use('/market', require('./marketRoutes'));
router.use('/orders', require('./ordersRoutes'));
module.exports = router;
