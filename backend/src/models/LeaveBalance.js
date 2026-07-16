const mongoose = require("mongoose");

/**
 * Mongoose Schema representing individual Employee Leave Balances ledger registry.
 */
const LeaveBalanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    balances: [
      {
        type: {
          type: String,
          required: true,
          trim: true,
        },
        total: {
          type: Number,
          required: true,
          min: 0,
        },
        used: {
          type: Number,
          required: true,
          default: 0,
          min: 0,
        },
        available: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LeaveBalance", LeaveBalanceSchema);
