const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Department = require("../models/department");
const Designation = require("../models/designation");

const getEmployeeModel = () => require("../models/employee");

// Generate unique numeric-only Employee ID 
const generateEmployeeId = async () => {
    const Employee = getEmployeeModel();
    const lastEmployee = await Employee.findOne().sort({ employeeId: -1 }).lean();
    const lastId = lastEmployee?.employeeId ? parseInt(lastEmployee.employeeId) : 10001;
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
    generateEmployeeId,
    generateDeptId,
    generateDesignationId,
    generatePassword,
    hashPassword,
    comparePassword,
};
