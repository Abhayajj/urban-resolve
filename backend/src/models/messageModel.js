const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  senderType: { type: String, enum: ['Admin', 'Department', 'Citizen'], required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
  receiverType: { type: String, enum: ['Admin', 'Department', 'Citizen'], required: true },
  content: { type: String, required: true },
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }, // Optional context
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
