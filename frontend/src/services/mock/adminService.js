import apiClient from "@/lib/axios";

/**
 * Service Layer calling Express API HR/Admin operations.
 */
export const adminService = {
  /**
   * Fetches summary statistics counters for the admin dashboard.
   */
  getAdminStats: async () => {
    const response = await apiClient.get("/admin/stats");
    return response.data.data;
  },

  /**
   * Spotlight search utility across multiple collections.
   */
  globalSearch: async (keyword) => {
    if (!keyword || keyword.trim().length < 2) {
      return { employees: [], departments: [], holidays: [], leaveTypes: [] };
    }
    const response = await apiClient.get("/search", { params: { q: keyword } });
    return response.data.data;
  },

  /**
   * Fetches paginated, filtered employee directory roster lists.
   */
  getEmployees: async (options = {}) => {
    const { page = 1, limit = 5, filters = {} } = options;
    const params = {
      page,
      limit,
      search: filters.search,
      department: filters.department,
      role: filters.role,
    };
    const response = await apiClient.get("/admin/employees", { params });
    return response.data.data;
  },

  /**
   * Fetch single employee details by ID.
   */
  getEmployeeById: async (employeeId) => {
    const response = await apiClient.get(`/admin/employees/${employeeId}`);
    return response.data.data;
  },

  /**
   * Creates a new employee record and registers system log traces.
   */
  createEmployee: async (employeeData) => {
    const response = await apiClient.post("/admin/employees", employeeData);
    return response.data.data;
  },

  /**
   * Updates an existing employee profile details.
   */
  updateEmployee: async (employeeId, employeeData) => {
    const response = await apiClient.put(`/admin/employees/${employeeId}`, employeeData);
    return response.data.data;
  },

  /**
   * Soft deletes a specific employee (sets isActive = false).
   */
  softDeleteEmployee: async (employeeId) => {
    await apiClient.delete(`/admin/employees/${employeeId}`);
    return true;
  },

  /**
   * Restores a soft-deleted employee profile.
   */
  restoreEmployee: async (employeeId) => {
    await apiClient.patch(`/admin/employees/${employeeId}/restore`);
    return true;
  },

  /**
   * Updates user role permissions credentials.
   */
  updateRole: async (employeeId, role) => {
    const response = await apiClient.patch(`/admin/employees/${employeeId}/role`, { role });
    return response.data.data;
  },

  /**
   * Retrieves active department lists.
   */
  getDepartments: async () => {
    const response = await apiClient.get("/admin/departments");
    return response.data.data;
  },

  /**
   * Registers a new department.
   */
  createDepartment: async (deptData) => {
    const response = await apiClient.post("/admin/departments", deptData);
    return response.data.data;
  },

  /**
   * Updates an existing department.
   */
  updateDepartment: async (deptId, deptData) => {
    const response = await apiClient.put(`/admin/departments/${deptId}`, deptData);
    return response.data.data;
  },

  /**
   * Deletes a department record.
   */
  deleteDepartment: async (deptId) => {
    await apiClient.delete(`/admin/departments/${deptId}`);
    return true;
  },

  /**
   * Retrieves leave types policy regulations list.
   */
  getLeaveTypes: async () => {
    const response = await apiClient.get("/admin/leave-types");
    return response.data.data;
  },

  /**
   * Creates a new leave type policy ruleset.
   */
  createLeaveType: async (policyData) => {
    const response = await apiClient.post("/admin/leave-types", policyData);
    return response.data.data;
  },

  /**
   * Modifies an existing leave type policy.
   */
  updateLeaveType: async (policyId, policyData) => {
    const response = await apiClient.put(`/admin/leave-types/${policyId}`, policyData);
    return response.data.data;
  },

  /**
   * Deletes a leave type policy.
   */
  deleteLeaveType: async (policyId) => {
    await apiClient.delete(`/admin/leave-types/${policyId}`);
    return true;
  },

  /**
   * Retrieves active holidays catalog registry lists.
   */
  getHolidays: async () => {
    const response = await apiClient.get("/admin/holidays");
    return response.data.data;
  },

  /**
   * Registers a new public/company holiday.
   */
  createHoliday: async (holidayData) => {
    const response = await apiClient.post("/admin/holidays", holidayData);
    return response.data.data;
  },

  /**
   * Updates an existing holiday.
   */
  updateHoliday: async (holidayId, holidayData) => {
    const response = await apiClient.put(`/admin/holidays/${holidayId}`, holidayData);
    return response.data.data;
  },

  /**
   * Removes a holiday record from the registry.
   */
  deleteHoliday: async (holidayId) => {
    await apiClient.delete(`/admin/holidays/${holidayId}`);
    return true;
  },

  /**
   * Retrieves paginated system audit logs.
   */
  getAuditLogs: async (options = {}) => {
    const { page = 1, limit = 5, filters = {} } = options;
    const params = {
      page,
      limit,
      search: filters.search,
    };
    const response = await apiClient.get("/admin/audits", { params });
    return response.data.data;
  },

  /**
   * Retrieves global configuration settings.
   */
  getSettings: async () => {
    const response = await apiClient.get("/admin/settings");
    return response.data.data;
  },

  /**
   * Updates global configuration settings.
   */
  updateSettings: async (settingsData) => {
    const response = await apiClient.put("/admin/settings", settingsData);
    return response.data.data;
  },
};

export default adminService;
