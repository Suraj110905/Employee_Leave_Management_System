/**
 * Shared validation utility routines for input forms.
 */
export const validationUtils = {
  /**
   * Validates standard email address formats.
   *
   * @param {string} email - Target email string.
   * @returns {boolean} True if email is valid.
   */
  validateEmail: (email) => {
    if (!email) return false;
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  },

  /**
   * Validates minimum characters length on text blocks.
   *
   * @param {string} text - Target text.
   * @param {number} [min=1] - Minimum characters required.
   * @returns {boolean} True if text satisfies the constraint.
   */
  validateMinLength: (text, min = 1) => {
    if (!text) return false;
    return text.trim().length >= min;
  },

  /**
   * Checks if startDate falls before or matches endDate.
   *
   * @param {string} startDateStr - ISO format start date string (YYYY-MM-DD).
   * @param {string} endDateStr - ISO format end date string (YYYY-MM-DD).
   * @returns {boolean} True if dates are ordered correctly.
   */
  validateDateRange: (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return false;
    return startDateStr <= endDateStr;
  },
};

export default validationUtils;
