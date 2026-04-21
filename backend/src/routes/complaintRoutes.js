const express = require("express");
const router = express.Router();

const {
  getAllComplaints,
  getMyComplaints,
  createComplaint,
  updateComplaintStatus,
  addFeedback
} = require("../controllers/complaintController");

const { protect, authorize } = require("../middlewares/authMiddleware");

// Routes
router.get("/", protect, authorize("department", "admin"), getAllComplaints);
router.get("/my", protect, authorize("citizen"), getMyComplaints);
router.post("/", protect, authorize("citizen"), createComplaint);
router.put("/:id", protect, authorize("department", "admin"), updateComplaintStatus);
router.post("/:id/feedback", protect, authorize("citizen"), addFeedback);

module.exports = router;