const mongoose = require("mongoose");

/**
 * Mongoose Schema representing corporate Leave Category Types policy guidelines.
 */
const LeaveTypeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    annualLimit: {
      type: Number,
      required: true,
      min: 0,
    },
    carryForward: {
      type: Boolean,
      required: true,
      default: false,
    },
    genderPolicy: {
      type: String,
      enum: ["All", "Male Only", "Female Only"],
      default: "All",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LeaveType", LeaveTypeSchema);
