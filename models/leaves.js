const mongoose = require("mongoose");
const Trainee = require("./trainee");
const leaves = new mongoose.Schema({
  traineeId: {
    type: String,
    trim: true,
    required: true,
    ref: "Trainee",
  },
  leaveId: {
    type: String,
    unique: true,
    trim: true,
  },

  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return this.startDate < value;
      },
      message: "End date must be after the start date.",
    },
  },
  duration: {
    type: Number,
  },
  reason: {
    type: String,
    required: true,
  },
  dateRequested: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateApproved: {
    type: Date,
  },
  status: {
    type: String,
    default: "Submitted",
  },
  leaveType: {
    type: String,
    reqiured: true,
  },
  repManagerId: {
    type: String,
    required: true,
  },
  workHandOverTo: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  logId: {
    type: String,
  },
});

module.exports = mongoose.model("leaves", leaves, "leaves");
