const express = require('express');
const router = express.Router();
const {
  getSatelliteImages,
  getSatelliteById,
  uploadSatelliteImage,
  updateDetection
} = require('../controllers/satelliteController');
const { protect } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/role');
const upload = require('../middlewares/upload');

router.get('/', protect, getSatelliteImages);
router.post('/', protect, upload.single('satelliteImage'), uploadSatelliteImage);
router.get('/:id', protect, getSatelliteById);
router.put('/:id/detection', protect, restrictTo('Admin'), updateDetection);

module.exports = router;
