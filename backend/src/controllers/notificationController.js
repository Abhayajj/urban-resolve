const Notification = require('../models/notificationModel');

// @desc    Create and broadcast notification
const createNotification = async (req, res) => {
  try {
    const { title, message, target, priority, ward } = req.body;
    const notification = await Notification.create({
      title,
      message,
      target,
      priority,
      ward,
      createdBy: req.user.id
    });
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all notifications (Admin)
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get notifications for citizens
const getCitizenNotifications = async (req, res) => {
  try {
    const ward = req.query.ward;
    const notifications = await Notification.find({
      $or: [
        { target: 'All Citizens' },
        { target: 'Specific Ward', ward: ward }
      ]
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createNotification,
  getAllNotifications,
  getCitizenNotifications
};
