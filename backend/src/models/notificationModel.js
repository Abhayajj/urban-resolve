const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  target: { type: String, enum: ['All Citizens', 'All Departments', 'Specific Ward'], default: 'All Citizens' },
  priority: { type: String, enum: ['Normal', 'High', 'Urgent'], default: 'Normal' },
  ward: { type: String }, // Optional for 'Specific Ward' target
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
