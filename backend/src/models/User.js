const mongoose = require("mongoose");

/**
 * Mongoose Schema representing User profiles, credential hashes, and organization references.
 */
const UserSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["employee", "manager", "hr_admin"],
      default: "employee",
      index: true,
    },
    department: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    managerId: {
      type: String,
      default: null,
      index: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    emailAlerts: {
      type: Boolean,
      default: true,
    },
    smsAlerts: {
      type: Boolean,
      default: false,
    },
    pushAlerts: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Optimize database queries using index parameters
UserSchema.index({ employeeId: 1, email: 1 });

module.exports = mongoose.model("User", UserSchema);
