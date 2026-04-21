const express = require('express');
const router = express.Router();
const { registerDepartment, loginDepartment } = require('../controllers/authController');
const { getDepartmentProfile } = require('../controllers/departmentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/register', registerDepartment);
router.post('/login', loginDepartment);
router.get('/profile', protect, authorize('department', 'admin'), getDepartmentProfile);

module.exports = router;
