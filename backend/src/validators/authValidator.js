/**
 * Authentication request payload validators.
 * Runs payload schema constraints checks and returns standardized error structures.
 */

/**
 * Validates login request body credentials.
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !email.trim()) {
    errors.push("Email is required.");
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push("Invalid email format.");
  }

  if (!password) {
    errors.push("Password is required.");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Request validation failed.",
      errors,
    });
  }

  next();
};

/**
 * Validates change password payload parameters.
 */
const validateChangePassword = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const errors = [];

  if (!currentPassword) {
    errors.push("Current password is required.");
  }

  if (!newPassword || newPassword.length < 6) {
    errors.push("New password must be at least 6 characters.");
  }

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
  validateLogin,
  validateChangePassword,
};
