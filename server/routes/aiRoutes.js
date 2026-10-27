const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { getAiStatus, analyzeIntel, executePrompt } = require('../controllers/aiController');

// Status can be queried publicly
router.get('/status', getAiStatus);

// AI intelligence operations require authentication
router.post('/analyze', protect, analyzeIntel);
router.post('/prompt', protect, executePrompt);

module.exports = router;
