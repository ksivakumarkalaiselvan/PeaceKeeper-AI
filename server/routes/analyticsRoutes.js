const express = require('express');
const router = express.Router();
const {
  getMonthlyTrends,
  getByCountry,
  getRiskDistribution,
  getViolations
} = require('../controllers/analyticsController');
const { protect } = require('../middlewares/auth');

router.get('/monthly', protect, getMonthlyTrends);
router.get('/by-country', protect, getByCountry);
router.get('/risk-distribution', protect, getRiskDistribution);
router.get('/violations', protect, getViolations);

module.exports = router;
