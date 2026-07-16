const LeaveBalance = require("../models/LeaveBalance");

/**
 * Repository layer for isolating Leave Balance database operations.
 */
class LeaveBalanceRepository {
  /**
   * Fetch leave balance ledger for a specific employee.
   *
   * @param {string} employeeId - Unique employee ID.
   * @returns {Promise<object|null>} The Mongoose LeaveBalance document or null.
   */
  async findByEmployeeId(employeeId) {
    return LeaveBalance.findOne({ employeeId });
  }

  /**
   * Saves or updates a LeaveBalance document directly.
   *
   * @param {object} balanceDoc - Mongoose document or plain object to save.
   * @param {object} [options] - DB options.
   * @returns {Promise<object>} Saved document.
   */
  async save(balanceDoc, options = {}) {
    if (balanceDoc && typeof balanceDoc.save === "function") {
      return balanceDoc.save(options);
    }
    const doc = new LeaveBalance(balanceDoc);
    return doc.save(options);
  }
}

module.exports = new LeaveBalanceRepository();
