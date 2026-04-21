const express = require('express');
const router = express.Router();
const { 
  createNotification, 
  getAllNotifications, 
  getCitizenNotifications 
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Admin only: Broadcast and view all
router.post('/', protect, authorize('admin'), createNotification);
router.get('/all', protect, authorize('admin'), getAllNotifications);

// Citizens: Get relevant notifications
router.get('/citizen', protect, authorize('citizen'), getCitizenNotifications);

module.exports = router;
