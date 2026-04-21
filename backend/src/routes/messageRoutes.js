const express = require('express');
const router = express.Router();
const { sendMessage, getChat } = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, sendMessage);
router.get('/:otherUserId', protect, getChat);

module.exports = router;
