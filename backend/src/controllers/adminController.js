const Admin = require('../models/adminModel');
const Citizen = require('../models/citizenModel');
const Department = require('../models/departmentModel');
const Complaint = require('../models/complaintModel');

// @desc    Get admin profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (admin) res.json(admin);
    else res.status(404).json({ message: 'Admin not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Get all citizens
const getAllCitizens = async (req, res) => {
  try {
    const citizens = await Citizen.find({}).select('-password');
    res.json(citizens);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Get all departments
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find({}).select('-password');
    res.json(departments);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Get system analytics
const getAnalytics = async (req, res) => {
  try {
    const totalCitizens = await Citizen.countDocuments();
    const totalDepartments = await Department.countDocuments();
    const complaints = await Complaint.find({});
    
    const stats = {
      totalCitizens,
      totalDepartments,
      totalComplaints: complaints.length,
      pending: complaints.filter(c => c.status === 'Pending').length,
      inProgress: complaints.filter(c => c.status === 'In Progress').length,
      resolved: complaints.filter(c => c.status === 'Resolved' || c.status === 'Completed').length,
      categoryStats: {
        'Water Supply': complaints.filter(c => c.category === 'Water Supply').length,
        'Roads': complaints.filter(c => c.category === 'Roads').length,
        'Sanitation': complaints.filter(c => c.category === 'Sanitation').length,
        'Electricity': complaints.filter(c => c.category === 'Electricity').length,
        'Street Lights': complaints.filter(c => c.category === 'Street Lights').length,
      }
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminProfile, getAllCitizens, getAllDepartments, getAnalytics };
