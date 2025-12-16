const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 300, // 5 minutes in seconds
  },
});

module.exports = mongoose.model("OTP", otpSchema);
