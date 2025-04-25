const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 255 
  },
  permissions: {
    type: [String], 
    default: []
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


const Role = mongoose.model('Role', RoleSchema);
module.exports = Role;