const express = require("express");
const router = express.Router();

const {
  handleChatCopilot,
  handleDuplicateScan,
  handleResolutionDraft
} = require("../controllers/aiController");

const { protect, authorize } = require("../middlewares/authMiddleware");

// AI endpoints
router.post("/chat", protect, handleChatCopilot);
router.post("/detect-duplicate", protect, handleDuplicateScan);
router.post("/suggest-resolution", protect, authorize("department", "admin"), handleResolutionDraft);

module.exports = router;
