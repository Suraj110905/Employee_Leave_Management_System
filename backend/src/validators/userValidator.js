/**
 * Profile updates payload validator.
 */
const validateProfile = (req, res, next) => {
  const { name, phone, emailAlerts, smsAlerts, pushAlerts } = req.body;
  const errors = [];

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      errors.push("Name cannot be blank.");
    }
  }

  if (phone !== undefined) {
    if (typeof phone !== "string") {
      errors.push("Phone must be a valid string.");
    }
  }

  if (emailAlerts !== undefined) {
    if (typeof emailAlerts !== "boolean") {
      errors.push("Email alerts preference must be a boolean.");
    }
  }

  if (smsAlerts !== undefined) {
    if (typeof smsAlerts !== "boolean") {
      errors.push("SMS alerts preference must be a boolean.");
    }
  }

  if (pushAlerts !== undefined) {
    if (typeof pushAlerts !== "boolean") {
      errors.push("Push alerts preference must be a boolean.");
    }
  }

  // Prevent modifying internal fields
  const forbiddenFields = ["role", "employeeId", "department", "designation", "managerId", "passwordHash"];
  forbiddenFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      errors.push(`Modification of field [${field}] is forbidden.`);
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Request validation failed.",
      errors,
    });
  }

  next();
};

module.exports = {
  validateProfile,
};
