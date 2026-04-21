const Message = require('../models/messageModel');

// @desc    Send message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, receiverType, content, complaintId } = req.body;
    const message = await Message.create({
      senderId: req.user.id,
      senderType: req.user.role === 'admin' ? 'Admin' : req.user.role === 'citizen' ? 'Citizen' : 'Department',
      receiverId,
      receiverType,
      content,
      complaintId
    });
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get chat history between two users
const getChat = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { sendMessage, getChat };
