const mongoose = require("mongoose");

/**
 * Mongoose Schema representing standard system Notifications alerts.
 */
const NotificationSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    type: {
      type: String,
      enum: ["LeaveApproval", "LeaveRequest", "PolicyChange", "SystemAlert", "HolidayAlert"],
      default: "SystemAlert",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", NotificationSchema);
