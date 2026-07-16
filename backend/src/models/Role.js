const mongoose = require("mongoose");

/**
 * Mongoose Schema representing User Security Access Roles.
 */
const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["employee", "manager", "hr_admin"],
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Role", RoleSchema);
