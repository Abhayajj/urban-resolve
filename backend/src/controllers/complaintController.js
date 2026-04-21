const Complaint = require("../models/complaintModel");

/* GET ALL COMPLAINTS */
const getAllComplaints = async (req, res) => {
  try {
    let query = {};

    if (req.user && req.user.role === 'department') {
      const deptName = req.user.departmentName;
      const categoryMap = {
        'Water Supply': 'Water Supply',
        'Electricity Board': 'Electricity',
        'Roads & Infrastructure': 'Roads',
        'Sanitation': 'Sanitation',
        'Street Lights Dept': 'Street Lights'
      };
      const mappedCategory = categoryMap[deptName];
      if (mappedCategory) query.category = mappedCategory;
    }

    const complaints = await Complaint.find(query).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET MY COMPLAINTS (Citizen) */
const getMyComplaints = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const complaints = await Complaint.find({ citizenId: userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* CREATE NEW COMPLAINT */
const createComplaint = async (req, res) => {
  try {
    if (req.user && req.user.id) {
      req.body.citizenId = req.user.id;
    }
    const newComplaint = new Complaint(req.body);
    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* UPDATE COMPLAINT STATUS (Dept/Admin) */
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, resolutionNotes },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ADD FEEDBACK (Citizen) */
const addFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) return res.status(404).json({ message: "Not found" });
    
    // Verify ownership
    const userId = req.user.id || req.user._id;
    if (complaint.citizenId.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Not authorized" });
    }

    complaint.feedbackRating = rating;
    complaint.feedbackComment = comment;
    await complaint.save();
    
    res.json({ success: true, message: "Feedback added" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllComplaints,
  getMyComplaints,
  createComplaint,
  updateComplaintStatus,
  addFeedback
};