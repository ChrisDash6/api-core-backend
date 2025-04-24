const mongoose = require("mongoose");
const Trainee = require("./trainee");

const AddressSchema = new mongoose.Schema({
  traineeId: {
    type: String,
    required: true,
    ref: "Trainee",
  },
  type: {
    type: String,
    enum: ["temporary", "permanent"],
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "active",
  },
  houseNo: {
    type: String,
    required: [true, "House or unit no is required"],
    trim: true,
  },
  street: {
    type: String,
    required: [true, "Street is required"],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "City is required"],
  },
  province: {
    type: String,
    required: [true, "Province is required"],
  },
  country: {
    type: String,
    required: [true, "Country is required"],
  },
  pincode: {
    type: String,
    required: [true, "Pincode is required"],
    match: [/^\d{5,6}$/, "Pincode must be 5 or 6 digits"],
  },
});

module.exports = mongoose.model("Address", AddressSchema,"address");