const express = require('express');
const router = express.Router();

const { registerAdmin, loginAdmin, updateAdminPassword } = require('../controllers/authController');
const { getAdminProfile, getAllCitizens, getAllDepartments } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// ✅ UPDATED IMPORT
const { loginDepartment, registerDepartment, updateDepartmentPassword } = require("../controllers/authController");

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.put('/update-password', protect, authorize('admin'), updateAdminPassword);
router.put('/update-dept-password', protect, updateDepartmentPassword);

router.get('/profile', protect, authorize('admin'), getAdminProfile);
router.get('/citizens', protect, authorize('admin'), getAllCitizens);
router.get('/departments', protect, authorize('admin'), getAllDepartments);
router.get('/analytics', protect, authorize('admin'), require('../controllers/adminController').getAnalytics);

// ✅ ADD THIS
router.post("/register-department", registerDepartment);

// ✅ ALREADY CORRECT
router.post("/login-department", loginDepartment);

module.exports = router;