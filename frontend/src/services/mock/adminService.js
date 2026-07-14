import {
  MOCK_EMPLOYEES_DB,
  MOCK_DEPARTMENTS_DB,
  MOCK_LEAVE_TYPES_DB,
  MOCK_HOLIDAYS_DB,
  MOCK_AUDIT_LOGS_DB,
} from "@/data/adminMock";

// Local mutable snapshots mimicking server-side database records
let employeesDataset = [...MOCK_EMPLOYEES_DB];
let departmentsDataset = [...MOCK_DEPARTMENTS_DB];
let leaveTypesDataset = [...MOCK_LEAVE_TYPES_DB];
let holidaysDataset = [...MOCK_HOLIDAYS_DB];
let auditLogsDataset = [...MOCK_AUDIT_LOGS_DB];

/**
 * Helper to simulate network delay (400ms to 750ms).
 *
 * @returns {number} Delay in milliseconds.
 */
const getDelay = () => Math.floor(Math.random() * (750 - 400 + 1) + 400);

/**
 * Helper to write a system audit log.
 *
 * @param {string} actor - User initiating the action.
 * @param {string} action - Event description.
 * @param {string} target - Target affected record.
 * @param {string} type - Audit log classification.
 */
const logSystemEvent = (actor, action, target, type) => {
  auditLogsDataset = [
    {
      timestamp: new Date().toISOString(),
      actor,
      action,
      target,
      type,
    },
    ...auditLogsDataset,
  ];
};

/**
 * Service Layer mimicking Express API Admin operations.
 */
export const adminService = {
  /**
   * Fetches summary statistics counters for the admin dashboard.
   *
   * @returns {Promise<Object>} Statistics counts KPI metrics.
   */
  getAdminStats: async () => {
    // REAL BACKEND API PATHWAY:
    // GET /api/v1/admin/stats
    await new Promise((resolve) => setTimeout(resolve, getDelay()));

    const totalHeadcount = employeesDataset.filter((e) => e.isActive).length;
    const departmentsCount = departmentsDataset.length;
    const leaveTypesCount = leaveTypesDataset.length;
    const holidaysCount = holidaysDataset.length;

    return {
      totalHeadcount,
      departmentsCount,
      leaveTypesCount,
      holidaysCount,
      activeLeavesCount: 1, // Mock dynamic parameter
      pendingReviewsCount: 2, // Mock reviews queue
    };
  },

  /**
   * Queries across all active collections, returning categorized search results.
   * Spotlight search utility.
   *
   * @param {string} keyword - Search query.
   * @returns {Promise<Object>} Categorized search results.
   */
  globalSearch: async (keyword) => {
    // REAL BACKEND API PATHWAY:
    // GET /api/v1/admin/search?q=...
    if (!keyword || keyword.trim().length < 2) {
      return { employees: [], departments: [], holidays: [], leaveTypes: [] };
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
    const term = keyword.toLowerCase();

    const matchedEmployees = employeesDataset
      .filter((e) => e.isActive && (e.name.toLowerCase().includes(term) || e.email.toLowerCase().includes(term)))
      .slice(0, 3);

    const matchedDepartments = departmentsDataset
      .filter((d) => d.name.toLowerCase().includes(term))
      .slice(0, 3);

    const matchedHolidays = holidaysDataset
      .filter((h) => h.name.toLowerCase().includes(term))
      .slice(0, 3);

    const matchedLeaveTypes = leaveTypesDataset
      .filter((l) => l.type.toLowerCase().includes(term))
      .slice(0, 3);

    return {
      employees: matchedEmployees,
      departments: matchedDepartments,
      holidays: matchedHolidays,
      leaveTypes: matchedLeaveTypes,
    };
  },

  /**
   * Fetches paginated, filtered employee directory roster lists.
   *
   * @param {Object} options - Filtering query parameters.
   * @param {number} [options.page=1] - Page number.
   * @param {number} [options.limit=10] - Items per page.
   * @param {Object} [options.filters] - Roster filters config.
   * @param {string} [options.filters.department] - Filter by department name.
   * @param {string} [options.filters.role] - Filter by employee role.
   * @param {string} [options.filters.search] - Search by name keyword.
   * @returns {Promise<Object>} Paginated payload structure.
   */
  getEmployees: async (options = {}) => {
    // REAL BACKEND API PATHWAY:
    // GET /api/v1/admin/employees
    await new Promise((resolve) => setTimeout(resolve, getDelay()));

    const { page = 1, limit = 5, filters = {} } = options;
    let items = employeesDataset.filter((e) => e.isActive); // Ignore soft-deleted accounts

    if (filters.department) {
      items = items.filter((e) => e.department.toLowerCase() === filters.department.toLowerCase());
    }

    if (filters.role) {
      items = items.filter((e) => e.role.toLowerCase() === filters.role.toLowerCase());
    }

    if (filters.search) {
      const keyword = filters.search.toLowerCase();
      items = items.filter((e) => e.name.toLowerCase().includes(keyword) || e.email.toLowerCase().includes(keyword));
    }

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const offset = (page - 1) * limit;
    const paginatedItems = items.slice(offset, offset + limit);

    return {
      data: paginatedItems,
      total,
      page,
      limit,
      totalPages,
    };
  },

  /**
   * Creates a new employee record and registers system log traces.
   *
   * @param {Object} employeeData - Form properties.
   * @returns {Promise<Object>} Created user profile.
   */
  createEmployee: async (employeeData) => {
    // REAL BACKEND API PATHWAY:
    // POST /api/v1/admin/employees
    await new Promise((resolve) => setTimeout(resolve, getDelay()));

    const newId = `EMP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newEmployee = {
      ...employeeData,
      id: newId,
      isActive: true,
    };

    employeesDataset = [...employeesDataset, newEmployee];
    logSystemEvent("Clara Croft (ADM-30044)", `Registered Employee profile ${newId}`, newEmployee.name, "Security");

    return newEmployee;
  },

  /**
   * Updates an existing employee profile details.
   *
   * @param {string} employeeId - Target employee.
   * @param {Object} employeeData - Form fields.
   * @returns {Promise<Object>} Modified profile details.
   */
  updateEmployee: async (employeeId, employeeData) => {
    // REAL BACKEND API PATHWAY:
    // PUT /api/v1/admin/employees/:id
    await new Promise((resolve) => setTimeout(resolve, getDelay()));

    const idx = employeesDataset.findIndex((e) => e.id === employeeId);
    if (idx === -1) throw new Error("Employee not found.");

    const updated = {
      ...employeesDataset[idx],
      ...employeeData,
    };

    employeesDataset = [
      ...employeesDataset.slice(0, idx),
      updated,
      ...employeesDataset.slice(idx + 1),
    ];

    logSystemEvent("Clara Croft (ADM-30044)", `Updated Employee profile ${employeeId}`, updated.name, "Configuration");
    return updated;
  },

  /**
   * Soft deletes a specific employee (sets isActive = false).
   *
   * @param {string} employeeId - Target employee.
   * @returns {Promise<boolean>}
   */
  softDeleteEmployee: async (employeeId) => {
    // REAL BACKEND API PATHWAY:
    // DELETE /api/v1/admin/employees/:id
    await new Promise((resolve) => setTimeout(resolve, getDelay()));

    const idx = employeesDataset.findIndex((e) => e.id === employeeId);
    if (idx === -1) throw new Error("Employee not found.");

    const updated = {
      ...employeesDataset[idx],
      isActive: false,
    };

    employeesDataset = [
      ...employeesDataset.slice(0, idx),
      updated,
      ...employeesDataset.slice(idx + 1),
    ];

    logSystemEvent("Clara Croft (ADM-30044)", `Soft-Deleted employee profile ${employeeId}`, updated.name, "Security");
    return true;
  },

  /**
   * Retrieves active department lists.
   *
   * @returns {Promise<Array>} Departments list.
   */
  getDepartments: async () => {
    // REAL BACKEND API PATHWAY:
    // GET /api/v1/admin/departments
    await new Promise((resolve) => setTimeout(resolve, getDelay()));
    return departmentsDataset;
  },

  /**
   * Registers a new department.
   *
   * @param {Object} deptData - Form details.
   * @returns {Promise<Object>} Created department.
   */
  createDepartment: async (deptData) => {
    // REAL BACKEND API PATHWAY:
    // POST /api/v1/admin/departments
    await new Promise((resolve) => setTimeout(resolve, getDelay()));

    const newId = `DEPT-${(departmentsDataset.length + 1).toString().padStart(2, "0")}`;
    const newDept = {
      ...deptData,
      id: newId,
      headcount: 1,
    };

    departmentsDataset = [...departmentsDataset, newDept];
    logSystemEvent("Clara Croft (ADM-30044)", `Registered Department ${newId}`, newDept.name, "Configuration");

    return newDept;
  },

  /**
   * Deletes a department record.
   *
   * @param {string} deptId - Target ID.
   * @returns {Promise<boolean>}
   */
  deleteDepartment: async (deptId) => {
    // REAL BACKEND API PATHWAY:
    // DELETE /api/v1/admin/departments/:id
    await new Promise((resolve) => setTimeout(resolve, getDelay()));

    departmentsDataset = departmentsDataset.filter((d) => d.id !== deptId);
    logSystemEvent("Clara Croft (ADM-30044)", `Deleted Department ${deptId}`, "System Records", "Configuration");
    return true;
  },

  /**
   * Retrieves leave types policy regulations list.
   *
   * @returns {Promise<Array>} Leave policies list.
   */
  getLeaveTypes: async () => {
    // REAL BACKEND API PATHWAY:
    // GET /api/v1/admin/leave-types
    await new Promise((resolve) => setTimeout(resolve, getDelay()));
    return leaveTypesDataset;
  },

  /**
   * Creates a new leave type policy ruleset.
   *
   * @param {Object} policyData - Form parameters.
   * @returns {Promise<Object>} Created type policy.
   */
  createLeaveType: async (policyData) => {
    // REAL BACKEND API PATHWAY:
    // POST /api/v1/admin/leave-types
    await new Promise((resolve) => setTimeout(resolve, getDelay()));

    const newId = `LT-${(leaveTypesDataset.length + 1).toString().padStart(2, "0")}`;
    const newPolicy = {
      ...policyData,
      id: newId,
    };

    leaveTypesDataset = [...leaveTypesDataset, newPolicy];
    logSystemEvent("Clara Croft (ADM-30044)", `Registered Leave Type Policy ${newId}`, newPolicy.type, "Policy");

    return newPolicy;
  },

  /**
   * Modifies an existing leave type policy.
   *
   * @param {string} policyId - Target ID.
   * @param {Object} policyData - Config updates.
   * @returns {Promise<Object>} Modified record parameters.
   */
  updateLeaveType: async (policyId, policyData) => {
    // REAL BACKEND API PATHWAY:
    // PUT /api/v1/admin/leave-types/:id
    await new Promise((resolve) => setTimeout(resolve, getDelay()));

    const idx = leaveTypesDataset.findIndex((l) => l.id === policyId);
    if (idx === -1) throw new Error("Leave type policy not found.");

    const updated = {
      ...leaveTypesDataset[idx],
      ...policyData,
    };

    leaveTypesDataset = [
      ...leaveTypesDataset.slice(0, idx),
      updated,
      ...leaveTypesDataset.slice(idx + 1),
    ];

    logSystemEvent("Clara Croft (ADM-30044)", `Updated Leave Policy parameters for ${policyId}`, updated.type, "Policy");
    return updated;
  },

  /**
   * Retrieves active holidays catalog registry lists.
   *
   * @returns {Promise<Array>} Holidays list.
   */
  getHolidays: async () => {
    // REAL BACKEND API PATHWAY:
    // GET /api/v1/admin/holidays
    await new Promise((resolve) => setTimeout(resolve, getDelay()));
    return holidaysDataset;
  },

  /**
   * Registers a new public/company holiday.
   *
   * @param {Object} holidayData - Form details.
   * @returns {Promise<Object>} Created holiday details.
   */
  createHoliday: async (holidayData) => {
    // REAL BACKEND API PATHWAY:
    // POST /api/v1/admin/holidays
    await new Promise((resolve) => setTimeout(resolve, getDelay()));

    const newId = `HOL-${(holidaysDataset.length + 1).toString().padStart(2, "0")}`;
    const newHoliday = {
      ...holidayData,
      id: newId,
    };

    holidaysDataset = [...holidaysDataset, newHoliday];
    logSystemEvent("Clara Croft (ADM-30044)", `Registered Holiday Event ${newId}`, newHoliday.name, "Calendar");

    return newHoliday;
  },

  /**
   * Removes a holiday record from the registry.
   *
   * @param {string} holidayId - Target ID.
   * @returns {Promise<boolean>}
   */
  deleteHoliday: async (holidayId) => {
    // REAL BACKEND API PATHWAY:
    // DELETE /api/v1/admin/holidays/:id
    await new Promise((resolve) => setTimeout(resolve, getDelay()));

    holidaysDataset = holidaysDataset.filter((h) => h.id !== holidayId);
    logSystemEvent("Clara Croft (ADM-30044)", `Removed Holiday Event ${holidayId}`, "System Calendar", "Calendar");
    return true;
  },

  /**
   * Retrieves paginated system audit logs.
   *
   * @param {Object} options - Filtering query parameters.
   * @returns {Promise<Object>} Audits list.
   */
  getAuditLogs: async (options = {}) => {
    // REAL BACKEND API PATHWAY:
    // GET /api/v1/admin/audits
    await new Promise((resolve) => setTimeout(resolve, getDelay()));

    const { page = 1, limit = 5 } = options;
    const items = [...auditLogsDataset];

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const offset = (page - 1) * limit;
    const paginatedItems = items.slice(offset, offset + limit);

    return {
      data: paginatedItems,
      total,
      page,
      limit,
      totalPages,
    };
  },
};

export default adminService;
