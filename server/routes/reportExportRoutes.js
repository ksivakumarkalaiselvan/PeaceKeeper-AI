const express = require('express');
const router = express.Router();
const { exportPdf, downloadPdf } = require('../controllers/reportExportController');
const { protect } = require('../middlewares/auth');

router.post('/:id/export-pdf', protect, exportPdf);
router.get('/:id/download', protect, downloadPdf);

module.exports = router;
