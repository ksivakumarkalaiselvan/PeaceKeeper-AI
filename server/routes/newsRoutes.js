const express = require('express');
const router = express.Router();
const { getNews, createNews, verifyNews, getFakeScore } = require('../controllers/newsController');
const { protect } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/role');

router.get('/', protect, getNews);
router.post('/', protect, createNews);
router.put('/:id/verify', protect, restrictTo('Admin'), verifyNews);
router.get('/:id/fake-score', protect, getFakeScore);

module.exports = router;
