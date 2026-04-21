const Notice = require('../models/noticeModel');

// @desc    Get all active notices
// @route   GET /api/v1/notices
// @access  Public
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Create a notice
// @route   POST /api/v1/notices
// @access  Private (Admin)
const createNotice = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const notice = await Notice.create({
      title,
      content,
      category,
      issuedBy: req.user.id
    });

    res.status(201).json(notice);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getNotices, createNotice };
