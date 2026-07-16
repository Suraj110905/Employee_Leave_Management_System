/**
 * Administrative HR validators.
 */

const validateEmployee = (req, res, next) => {
  const { name, email, role, department, designation } = req.body;
  const errors = [];

  if (req.method === "POST") {
    if (!name || !name.trim()) errors.push("Name is required.");
    if (!email || !email.trim()) errors.push("Email is required.");
    else if (!/\S+@\S+\.\S+/.test(email)) errors.push("Invalid email format.");
    if (!department || !department.trim()) errors.push("Department is required.");
    if (!designation || !designation.trim()) errors.push("Designation is required.");
    
    const roles = ["employee", "manager", "hr_admin"];
    if (role && !roles.includes(role)) {
      errors.push(`Invalid role. Allowed: ${roles.join(", ")}`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  next();
};

const validateDept = (req, res, next) => {
  const { name } = req.body;
  const errors = [];

  if (!name || !name.trim()) {
    errors.push("Department name is required.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  next();
};

const validateLeaveType = (req, res, next) => {
  const { type, annualLimit } = req.body;
  const errors = [];

  if (!type || !type.trim()) {
    errors.push("Leave type category name is required.");
  }

  if (annualLimit === undefined || annualLimit === null) {
    errors.push("Annual limit is required.");
  } else {
    const limit = Number(annualLimit);
    if (isNaN(limit) || limit < 0 || !Number.isInteger(limit)) {
      errors.push("Annual limit must be a positive integer.");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  next();
};

const validateHoliday = (req, res, next) => {
  const { name, date, type } = req.body;
  const errors = [];
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!name || !name.trim()) errors.push("Holiday name is required.");
  if (!date) errors.push("Holiday date is required.");
  else if (!dateRegex.test(date)) errors.push("Holiday date must be in YYYY-MM-DD format.");
  
  const types = ["National", "Company", "Other"];
  if (type && !types.includes(type)) {
    errors.push(`Invalid holiday type. Allowed: ${types.join(", ")}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  next();
};

const validateSettings = (req, res, next) => {
  const { companyName } = req.body;
  const errors = [];

  if (companyName !== undefined && (!companyName || !companyName.trim())) {
    errors.push("Company name cannot be blank.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  next();
};

module.exports = {
  validateEmployee,
  validateDept,
  validateLeaveType,
  validateHoliday,
  validateSettings,
};
