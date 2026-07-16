const mongoose = require("mongoose");

/**
 * Mongoose Schema representing corporate Departments structure, divisions, and team headcounts.
 */
const DepartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    managerId: {
      type: String,
      default: null,
      index: true,
      trim: true,
    },
    headcount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Department", DepartmentSchema);
