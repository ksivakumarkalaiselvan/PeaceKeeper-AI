const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/auth');

router.get('/summary', protect, getSummary);

module.exports = router;
