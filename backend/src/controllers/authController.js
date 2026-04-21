const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const Citizen = require('../models/citizenModel');
const Department = require('../models/departmentModel');

const generateToken = (id, role, extra = {}) => {
  return jwt.sign(
    { id, role, ...extra }, // 🔥 now supports departmentName etc.
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// ====================== ADMIN AUTH ======================
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await Admin.create({ name, email, password });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ====================== CITIZEN AUTH ======================
const registerCitizen = async (req, res) => {
  try {
    const {
      firstName, lastName, mobileNumber,
      email, aadhaarNumber, address,
      ward, block, password
    } = req.body;

    const emailExists = await Citizen.findOne({ email });
    if (emailExists) return res.status(400).json({ message: 'Citizen with this email already exists' });

    const mobileExists = await Citizen.findOne({ mobileNumber });
    if (mobileExists) return res.status(400).json({ message: 'Citizen with this mobile number already exists' });

    const aadhaarExists = await Citizen.findOne({ aadhaarNumber });
    if (aadhaarExists) return res.status(400).json({ message: 'Citizen with this Aadhaar number already exists' });

    const citizen = await Citizen.create({
      firstName, lastName, mobileNumber,
      email, aadhaarNumber, address,
      ward, block, password
    });

    if (citizen) {
      res.status(201).json({
        _id: citizen._id,
        firstName: citizen.firstName,
        lastName: citizen.lastName,
        email: citizen.email,
        mobileNumber: citizen.mobileNumber,
        ward: citizen.ward,
        block: citizen.block,
        role: citizen.role,
        token: generateToken(citizen._id, citizen.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid citizen data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginCitizen = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const citizen = await Citizen.findOne({
      $or: [{ email: email }, { mobileNumber: email }]
    });

    if (citizen && (await citizen.matchPassword(password))) {
      res.json({
        _id: citizen._id,
        firstName: citizen.firstName,
        lastName: citizen.lastName,
        email: citizen.email,
        mobileNumber: citizen.mobileNumber,
        ward: citizen.ward,
        block: citizen.block,
        role: citizen.role,
        token: generateToken(citizen._id, citizen.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email/mobile or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================== DEPARTMENT AUTH ======================
const registerDepartment = async (req, res) => {
  try {
    const { name, email, password, departmentName } = req.body;

    const departmentExists = await Department.findOne({ email });
    if (departmentExists) return res.status(400).json({ message: 'Department user already exists' });

    const department = await Department.create({
      name, email, password, departmentName
    });

    if (department) {
      res.status(201).json({
        _id: department._id,
        name: department.name,
        email: department.email,
        departmentName: department.departmentName,
        role: department.role,
        token: generateToken(department._id, department.role, {
          departmentName: department.departmentName // 🔥 added
        }),
      });
    } else {
      res.status(400).json({ message: 'Invalid department data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginDepartment = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const department = await Department.findOne({ email });

    if (department && (await department.matchPassword(password))) {
      res.json({
        _id: department._id,
        name: department.name,
        email: department.email,
        departmentName: department.departmentName,
        role: department.role,
        token: generateToken(department._id, department.role, {
          departmentName: department.departmentName // 🔥 added
        }),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCitizenPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id || req.user._id;

    const citizen = await Citizen.findById(userId);

    if (citizen && (await citizen.matchPassword(currentPassword))) {
      citizen.password = newPassword;
      await citizen.save();

      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Invalid current password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDepartmentPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id || req.user._id;

    const department = await Department.findById(userId);

    if (department && (await department.matchPassword(currentPassword))) {
      department.password = newPassword;
      await department.save();

      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Invalid current password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.user.id);
    
    if (!admin || !(await admin.matchPassword(currentPassword))) {
      return res.status(401).json({ message: "Invalid current security key" });
    }

    admin.password = newPassword;
    await admin.save();
    res.json({ message: "Master security key updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const googleMockLogin = async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;
    
    // Check if user already exists, or create a mock one
    let citizen = await Citizen.findOne({ email });
    if (!citizen) {
      citizen = await Citizen.create({
        firstName, lastName, email,
        password: "google_mock_password", // dummy
        mobileNumber: "0000000000",
        aadhaarNumber: "000000000000",
        address: "Urban Resolve City Center", // Added default address
        ward: "Ward 1",
        block: "Block A"
      });
    }

    res.json({
      _id: citizen._id,
      firstName: citizen.firstName,
      lastName: citizen.lastName,
      email: citizen.email,
      role: citizen.role,
      ward: citizen.ward,
      block: citizen.block,
      token: generateToken(citizen._id, citizen.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerAdmin, loginAdmin,
  registerCitizen, loginCitizen, updateCitizenPassword,
  registerDepartment, loginDepartment, updateDepartmentPassword,
  googleMockLogin, updateAdminPassword
};