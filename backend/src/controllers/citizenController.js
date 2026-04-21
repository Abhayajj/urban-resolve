const Citizen = require('../models/citizenModel');

// @desc    Get citizen profile
// @route   GET /api/v1/citizen/profile
// @access  Private
const getCitizenProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const citizen = await Citizen.findById(userId).select('-password');
    if (citizen) {
      res.json(citizen);
    } else {
      console.warn(`Stale session detected for ID: ${userId}`);
      res.status(404).json({ message: 'User record not found. Please logout and login again.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update citizen profile
// @route   PUT /api/v1/citizen/profile
// @access  Private
const updateCitizenProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    console.log('Update Request for User:', userId);
    console.log('Body:', req.body);

    const citizen = await Citizen.findById(userId);
    
    if (!citizen) {
      console.warn(`Update failed: Citizen record not found for ID: ${userId}`);
      return res.status(404).json({ message: 'User record not found. Session might be stale.' });
    }

    // Check unique constraints
    if (req.body.mobileNumber && req.body.mobileNumber !== citizen.mobileNumber) {
      const exists = await Citizen.findOne({ mobileNumber: req.body.mobileNumber });
      if (exists) return res.status(400).json({ message: 'Mobile number already in use' });
    }
    if (req.body.email && req.body.email !== citizen.email) {
      const exists = await Citizen.findOne({ email: req.body.email });
      if (exists) return res.status(400).json({ message: 'Email already in use' });
    }

    // Update fields
    const updatedCitizen = await Citizen.findByIdAndUpdate(
      userId,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          mobileNumber: req.body.mobileNumber,
          ward: req.body.ward,
          block: req.body.block,
          notificationPrefs: req.body.notificationPrefs
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedCitizen) {
      return res.status(404).json({ message: 'Update failed: User not found' });
    }

    console.log('Citizen updated successfully:', updatedCitizen._id);
    res.json(updatedCitizen);

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ 
      message: error.name === 'ValidationError' ? 'Invalid data provided' : 'Server error: ' + error.message 
    });
  }
};

module.exports = { getCitizenProfile, updateCitizenProfile };
