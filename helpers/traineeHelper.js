const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Department = require("../models/department");
const Designation = require("../models/designation");

const getTraineeModel = () => require("../models/trainee");

// Generate unique numeric-only Trainee ID 
const generateTraineeId = async () => {
  const Trainee = getTraineeModel();
  const lastTrainee = await Trainee.findOne().sort({ traineeId: -1 }).lean();
  const lastId = lastTrainee?.traineeId ? parseInt(lastTrainee.traineeId) : 11281;
  return (lastId + 1).toString();
};

// Generate unique Department ID 
const generateDeptId = async () => {
  const lastDepartment = await Department.findOne().sort({ departmentId: -1 }).exec();
  if (lastDepartment && lastDepartment.departmentId) {
    const lastIdNumber = parseInt(lastDepartment.departmentId.replace("DEPT", ""), 10);
    return `DEPT${(lastIdNumber + 1).toString().padStart(3, "0")}`;
  }
  return "DEPT001";
};

// Generate unique Designation ID 
const generateDesignationId = async () => {
  const lastDesignation = await Designation.findOne().sort({ designationId: -1 }).exec();
  if (lastDesignation && lastDesignation.designationId) {
    const match = lastDesignation.designationId.match(/^DESGN(\d+)$/);
    if (match) {
      const lastIdNumber = parseInt(match[1], 10);
      return `DESGN${(lastIdNumber + 1).toString().padStart(3, "0")}`;
    }
  }
  return "DESGN001";
};

// Generate secure random password
const generatePassword = (length = 12) => {
  if (length < 8) throw new Error("Password length must be at least 8 characters.");
  return crypto.randomBytes(length).toString("base64").slice(0, length);
};

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare hashed password
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  generateTraineeId,
  generateDeptId,
  generateDesignationId,
  generatePassword,
  hashPassword,
  comparePassword,
};
