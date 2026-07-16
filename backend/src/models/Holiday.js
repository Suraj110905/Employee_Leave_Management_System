const mongoose = require("mongoose");

/**
 * Mongoose Schema representing corporate and national public Holidays.
 */
const HolidaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["National", "Company", "Other"],
      default: "National",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Holiday", HolidaySchema);
