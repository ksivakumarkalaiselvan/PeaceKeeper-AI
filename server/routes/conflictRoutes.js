const express = require('express');
const router = express.Router();
const {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  uploadEvidence
} = require('../controllers/conflictController');
const { protect } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/role');
const upload = require('../middlewares/upload');

router.get('/', protect, getReports);
router.post('/', protect, upload.fields([{ name: 'evidenceImages', maxCount: 5 }]), createReport);
router.get('/:id', protect, getReportById);
router.put('/:id', protect, restrictTo('Admin'), updateReport);
router.delete('/:id', protect, restrictTo('Admin'), deleteReport);
router.post('/:id/evidence', protect, upload.fields([{ name: 'evidence', maxCount: 5 }]), uploadEvidence);

module.exports = router;
