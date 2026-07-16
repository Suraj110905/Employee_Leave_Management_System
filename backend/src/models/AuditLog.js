const mongoose = require("mongoose");

/**
 * Mongoose Schema representing System Actions Audit Logs.
 * Records administrative updates, configurations changes, and user accesses.
 */
const AuditLogSchema = new mongoose.Schema(
  {
    performedBy: {
      type: String, // employeeId of user performing action
      required: true,
      index: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["employee", "manager", "hr_admin"],
    },
    action: {
      type: String, // e.g. "USER_LOGIN", "LEAVE_APPROVED", "POLICY_UPDATED"
      required: true,
      index: true,
    },
    details: {
      type: String, // human-readable summary
      required: true,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Sorted retrieval performance optimization
AuditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("AuditLog", AuditLogSchema);
