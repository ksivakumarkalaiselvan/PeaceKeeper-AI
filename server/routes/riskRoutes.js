const express = require('express');
const router = express.Router();
const { getRiskByRegionOrId, recalculateRisk } = require('../controllers/riskController');
const { protect } = require('../middlewares/auth');

router.post('/recalculate', protect, recalculateRisk);
router.get('/:regionOrReportId?', protect, getRiskByRegionOrId);

module.exports = router;
