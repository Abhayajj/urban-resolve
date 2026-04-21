const express = require('express');
const router = express.Router();
const { createContact, getContacts } = require('../controllers/contactController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', createContact);
router.get('/', protect, authorize('admin'), getContacts);

module.exports = router;
