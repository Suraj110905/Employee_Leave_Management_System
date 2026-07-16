const mongoose = require("mongoose");

/**
 * Mongoose Schema representing Global Corporate Settings configuration metrics.
 */
const SettingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      default: "Acme Corporation Ltd",
      trim: true,
    },
    workingDays: [
      {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      },
    ],
    multiLevelApprovals: {
      type: Boolean,
      default: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", SettingsSchema);
