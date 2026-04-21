const express = require('express');
const router = express.Router();
const { registerCitizen, loginCitizen, updateCitizenPassword, googleMockLogin } = require('../controllers/authController');
const { getCitizenProfile, updateCitizenProfile } = require('../controllers/citizenController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/register', registerCitizen);
router.post('/login', loginCitizen);
router.post('/google-mock-login', googleMockLogin);
router.post('/update-password', protect, authorize('citizen'), updateCitizenPassword);
router.get('/profile', protect, authorize('citizen'), getCitizenProfile);
router.put('/profile', protect, authorize('citizen'), updateCitizenProfile);

module.exports = router;
