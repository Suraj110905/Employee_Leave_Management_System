const mongoose = require("mongoose");

/**
 * Mongoose Schema representing a submitted Employee Leave Request.
 */
const LeaveRequestSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    employeeId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    employeeName: {
      type: String,
      required: true,
      trim: true,
    },
    leaveType: {
      type: String,
      required: true,
      enum: ["Annual", "Sick", "Casual", "Maternity", "Paternity"],
      index: true,
    },
    startDate: {
      type: String,
      required: true,
      trim: true,
    },
    endDate: {
      type: String,
      required: true,
      trim: true,
    },
    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    workingDays: {
      type: Number,
      required: true,
      min: 1,
    },
    reason: {
      type: String,
      required: true,
      minlength: 10,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled"],
      default: "Pending",
      index: true,
    },
    reviewer: {
      type: String,
      default: null,
      trim: true,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    remarks: {
      type: String,
      default: null,
    },
    attachment: {
      type: String,
      default: null,
    },
    
    // Multi-stage approval metadata
    currentStage: {
      type: Number,
      default: 1,
    },
    totalStages: {
      type: Number,
      default: 1,
    },
    approvedBy: [
      {
        type: String,
        trim: true,
      },
    ],
    rejectedBy: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index configurations for performance optimizations
LeaveRequestSchema.index({ employeeId: 1, status: 1 });
LeaveRequestSchema.index({ startDate: -1 });

module.exports = mongoose.model("LeaveRequest", LeaveRequestSchema);
