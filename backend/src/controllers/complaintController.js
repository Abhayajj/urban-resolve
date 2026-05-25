const Complaint = require("../models/complaintModel");
const Department = require("../models/departmentModel");
const { classifyComplaint } = require("../utils/aiClassifier");

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

    const { title, description } = req.body;
    
    // AI Auto-classification
    const aiResult = await classifyComplaint(title, description);
    if (aiResult) {
      req.body.category = aiResult.category;
      req.body.subCategory = aiResult.subCategory;
      req.body.priority = aiResult.priority;
      console.log(`[AI Classifier] Auto-classified complaint:
        Category: ${aiResult.category}
        SubCategory: ${aiResult.subCategory}
        Priority: ${aiResult.priority}
        Reason: ${aiResult.reason}`);
    }

    // Auto-routing to department based on category
    let mappedDeptName = null;
    if (req.body.category === "Water Supply") mappedDeptName = "Water Supply";
    else if (req.body.category === "Electricity") mappedDeptName = "Electricity Board";
    else if (req.body.category === "Roads") mappedDeptName = "Roads & Infrastructure";
    else if (req.body.category === "Sanitation") mappedDeptName = "Sanitation";
    else if (req.body.category === "Street Lights") mappedDeptName = "Street Lights Dept";

    if (mappedDeptName) {
      let dept = await Department.findOne({ departmentName: mappedDeptName });
      // Fallback for Street Lights Dept to Electricity Board if not found
      if (!dept && mappedDeptName === "Street Lights Dept") {
        dept = await Department.findOne({ departmentName: "Electricity Board" });
      }
      if (dept) {
        req.body.departmentAssigned = dept._id;
        console.log(`[AI Routing] Assigned to department: ${mappedDeptName} (ID: ${dept._id})`);
      }
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
    const { status, resolutionNotes, departmentAssigned } = req.body;
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (resolutionNotes !== undefined) updateData.resolutionNotes = resolutionNotes;
    if (departmentAssigned !== undefined) updateData.departmentAssigned = departmentAssigned;

    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
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