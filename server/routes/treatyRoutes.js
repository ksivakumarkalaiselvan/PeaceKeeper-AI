const express = require('express');
const router = express.Router();
const {
  getTreaties,
  getTreatyById,
  createTreaty,
  updateTreaty,
  deleteTreaty
} = require('../controllers/treatyController');
const { protect } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/role');

router.get('/', protect, getTreaties);
router.post('/', protect, restrictTo('Admin'), createTreaty);
router.get('/:id', protect, getTreatyById);
router.put('/:id', protect, restrictTo('Admin'), updateTreaty);
router.delete('/:id', protect, restrictTo('Admin'), deleteTreaty);

module.exports = router;
