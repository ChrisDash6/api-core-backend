const mongoose = require("mongoose");
const encoder = require("bcryptjs");
const { gentraineeId, genPass } = require("../helpers/traineeHelper");
const address = require("./address");
const roles = require("./roles");
const department = require("./department");
const designation = require("./designation");

const TraineeSchema = mongoose.Schema({
  traineeId: {
    type: String,
    unique: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "First name should be min 3 characters"],
    maxlength: [50, "First name should be max of 50 characters"],
  },
  middleName: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "Middle name should be min 3 characters"],
    maxlength: [50, "Middle name should be max of 50 characters"],
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "Last name should be min 3 characters"],
    maxlength: [50, "Last name should be max of 50 characters"],
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  workMail: {
    type: String,
    required: true,
    trim: true,
    match: [/.+@.+\..+/, "Please enter a valid organization email"],
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
    match: [/^\+?1?\d{10}$/, "Please provide a valid phone number"],
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Date of Birth is required"],
  },
  gender: {
    type: String,
    required: [true, "Geneder is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
  ],
  bloodGroup: {
    type: String,
    required: true,
  },
  dateOfJoin: {
    type: Date,
    required: [true, "Date of join is mandatory"],
  },
  imageFolder: {
    type: String,
    default: null,
  },
  dateOfExit: {
    type: Date,
    default: null,
  },
  designations: {
    type: String,
    ref: "Designation",
    required: true,
  },
  roleRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  departmentId: {
    type: String,
    ref: "Department",
    required: true,
  },
  employmentType: {
    type: String,
    enum: ["Full-Time", "Part-Time", "Contract", "Internship"],
    required: [true, "Employment type is required"],
  },
  workLocation: {
    type: String,
    default: "Remote",
  },
  status: {
    type: String,
    enum: ["active", "inactive", "terminated"],
    default: "active",
  },
  accountNumber: {
    type: String,
    unique: true,
    required: [true, "Bank Account Number is Mandatory"],
  },
  transitNumber: {
    type: String,
    required: [true, "Transit Number is Mandatory"],
    minlength: [5, "Transit Number must be exactly 5 digits"],
    maxlength: [5, "Transit Number must be exactly 5 digits"],
    trim: true,
  },
  institutionNumber: {
    type: String,
    required: [true, "Institution Number is required"],
    minlength: [3, "Institution Number must be exactly 3 digits"],
    maxlength: [3, "Institution Number must be exactly 3 digits"],
    trim: true,
  },
  bankName: {
    type: String,
    required: [true, "Bank Name is required"],
    trim: true,
  },
  interacId: {
    type: String,
    required: true,
  },
  sin: {
    type: String,
    required: [true, "Social Insurance Number (SIN) is required"],
    unique: true,
    match: [/^\d{3}-\d{3}-\d{3}$/, "SIN must follow the format XXX-XXX-XXX"],
    trim: true,
  },
  taxCode: {
    type: String,
    required: [true, "Tax Code is required"],
    trim: true,
  },

  workPermitDetails: {
    type: String,
    trim: true,
    unique: true,
  },
  prDetails: {
    type: String,
    trim: true,
    unique: true,
  },
  citizenshipId: {
    type: String,
    trim: true,
    unique: true,
  },
  maritalStatus: {
    type: String,
    required: true,
  },
  emergencyContactName: {
    type: String,
    required: true,
  },
  emergencyContactNumber: {
    type: String,
    required: true,
    match: [/^\d{10,15}$/, "Phone number must be 10-15 digits"],
  },
  emergencyContactRelation: {
    type: String,
    required: true,
  },
  repManagerRef: {
    type: String,
    required: true,
    
  },
  healthCardNo:{
    type: String,
    default: ""
  },
  familyPractitionerName :{
    type : String,
    default: ""
  },
  practitionerClinicName : {
    type : String,
    defautlt: ""
  },
  practitionerName : {
    type : String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  logId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Trainee", TraineeSchema,"trainees");
