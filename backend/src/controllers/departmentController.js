const Department = require('../models/departmentModel');

// @desc    Get department profile
// @route   GET /api/v1/department/profile
// @access  Private
const getDepartmentProfile = async (req, res) => {
  try {
    const department = await Department.findById(req.user.id).select('-password');
    if (department) {
      res.json(department);
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDepartmentProfile };
