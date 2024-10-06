const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    // required: [true, 'Please provide a first name for this user.'],
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide an email for this user."],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password for this user."],
  },
  phoneNo: {
    type: String,
    // required: [true, 'Please provide a phone number for this user.'],
  },
  emergencyContactName: {
    type: String,
    // required: [true, 'Please provide an emergency contact Name for this user.'],
  },
  emergencyContactNo: {
    type: String,
    // required: [true, 'Please provide an emergency contact number for this user.'],
  },
  role: {
    type: String,
    enum: ["superadmin", "companyadmin", "departmenthead", "user"],
    required: [true, "Please provide a role for this user."],
  },
  companyRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  primarySkill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
  },
  secondarySkill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
  },
  departmentHead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  employeeId: {
    type: String,
    // required: [true, 'Please provide an employee ID for this user.'],
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Projects",
    default: null,
  },
  balanceOfAnnualLeaves: {
    type: Number,
    default: 16,
  },
  balanceOfMedicalLeaves: {
    type: Number,
    default: 12,
  },
  resetCode: {
    type: String,
    default: null,
  },
  lastLogin: {
    type: Date,
  },
  lastLogout: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    required: [true, "Please provide a status for this user."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
