const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  pdfFile: { type: String }, // PDF attachment link
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  category: { type: String, enum: ['General', 'Alert', 'Guideline'], default: 'General' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Notice = mongoose.model('Notice', noticeSchema);
module.exports = Notice;
