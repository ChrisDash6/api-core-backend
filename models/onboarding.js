const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  docType: {
    type: String, 
    required: true,
  },
  fileName: {
    type: String, 
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  remarks: {
    type: String,
    default: '',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  }
});

const OnboardingSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  documents: {
    type: [DocumentSchema], 
    default: [],
  },
  status: {
    type: String,
    enum: ['Pending', 'In Review', 'Completed', 'Rejected'],
    default: 'Pending',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  logId: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Onboarding', OnboardingSchema);
