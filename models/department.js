const mongoose = require('mongoose');
const Trainee=require('./trainee');


const DepartmentSchema = new mongoose.Schema({
  departmentId: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    match: [/^DEPT\d{3}$/, 'Department ID must follow the format DEPT001']
  },
  departmentName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  departmentAcronym: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 10
  },
  description: {
    type: String,
    trim: true
  },
  deptHead: {
    type: String,
    required: false,
    ref: 'Trainee', 
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  logId:{
    type: String,
    required: true
  }
});

const Department = mongoose.model('Department', DepartmentSchema);
module.exports = Department;
