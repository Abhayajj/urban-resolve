const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  citizenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Citizen', required: true },
  category: { type: String, required: true }, 
  subCategory: { type: String },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  ward: { type: String, required: true },
  image: { type: String }, // URL or path from fileupload
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'], default: 'Pending' },
  departmentAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  resolutionNotes: { type: String },
  feedbackRating: { type: Number, min: 1, max: 5 },
  feedbackComment: { type: String }
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;
