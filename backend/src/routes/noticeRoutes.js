const express = require('express');
const router = express.Router();
const { getNotices, createNotice } = require('../controllers/noticeController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', getNotices);
router.post('/', protect, authorize('admin'), createNotice);

module.exports = router;
