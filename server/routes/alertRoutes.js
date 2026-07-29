const express = require('express');
const router = express.Router();
const { getAlerts, createAlert, acknowledgeAlert, deleteAlert } = require('../controllers/alertController');
const { protect } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/role');

router.get('/', protect, getAlerts);
router.post('/', protect, createAlert);
router.put('/:id/acknowledge', protect, acknowledgeAlert);
router.delete('/:id', protect, restrictTo('Admin'), deleteAlert);

module.exports = router;
