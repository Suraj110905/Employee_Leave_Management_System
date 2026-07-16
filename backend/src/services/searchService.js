const User = require("../models/User");
const Department = require("../models/Department");
const Holiday = require("../models/Holiday");
const LeaveType = require("../models/LeaveType");

/**
 * Service orchestrating global searches across collections.
 */
class SearchService {
  /**
   * Search query text matched case-insensitively.
   * Runs queries concurrently using Promise.all.
   *
   * @param {string} keyword - Search query.
   * @returns {Promise<object>} Categorized search results.
   */
  async globalSearch(keyword) {
    if (!keyword || keyword.trim().length < 2) {
      return { employees: [], departments: [], holidays: [], leaveTypes: [] };
    }

    const term = keyword.trim();
    const regex = new RegExp(term, "i");

    // Perform queries concurrently
    const [employees, departments, holidays, leaveTypes] = await Promise.all([
      User.find({
        isActive: true,
        $or: [{ name: regex }, { email: regex }],
      }).limit(5),
      Department.find({ name: regex }).limit(5),
      Holiday.find({ name: regex }).limit(5),
      LeaveType.find({ type: regex }).limit(5),
    ]);

    return {
      employees: employees.map((e) => ({
        id: e.employeeId,
        name: e.name,
        email: e.email,
        department: e.department,
        designation: e.designation,
      })),
      departments: departments.map((d) => ({
        id: d._id,
        name: d.name,
        headcount: d.headcount,
      })),
      holidays: holidays.map((h) => ({
        id: h._id,
        name: h.name,
        date: h.date,
        type: h.type,
      })),
      leaveTypes: leaveTypes.map((l) => ({
        id: l._id,
        type: l.type,
        annualLimit: l.annualLimit,
      })),
    };
  }
}

module.exports = new SearchService();
