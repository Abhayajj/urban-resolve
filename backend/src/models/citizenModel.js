const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const citizenSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  aadhaarNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  ward: { type: String, required: true },
  block: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'citizen' },
  notificationPrefs: {
    sms: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    urgent: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Password hash middleware
citizenSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
citizenSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Citizen = mongoose.model('Citizen', citizenSchema);
module.exports = Citizen;
