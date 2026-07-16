const AuditLog = require("../models/AuditLog");

/**
 * Repository layer isolating database operations for Audit Logs.
 */
class AuditLogRepository {
  /**
   * Insert a new system audit action log.
   *
   * @param {object} logData - Action details payload (performedBy, role, action, details, ipAddress, userAgent).
   * @returns {Promise<object>} Created AuditLog Mongoose document.
   */
  async createLog(logData) {
    return AuditLog.create(logData);
  }
}

module.exports = new AuditLogRepository();
