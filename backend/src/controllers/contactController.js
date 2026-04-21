const Contact = require('../models/contactModel');

// @desc    Submit a contact structure
// @route   POST /api/v1/contact
// @access  Public
const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = await Contact.create({ name, email, subject, message });
    res.status(201).json({ message: 'Contact submitted successfully!', contact });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Get all contacts
// @route   GET /api/v1/contact
// @access  Private (Admin)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { createContact, getContacts };
