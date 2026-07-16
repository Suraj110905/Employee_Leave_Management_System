const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/userRepository");
const leaveBalanceRepository = require("../repositories/leaveBalanceRepository");
const leaveRequestRepository = require("../repositories/leaveRequestRepository");
const departmentRepository = require("../repositories/departmentRepository");
const leaveTypeRepository = require("../repositories/leaveTypeRepository");
const holidayRepository = require("../repositories/holidayRepository");
const settingsRepository = require("../repositories/settingsRepository");
const auditLogRepository = require("../repositories/auditLogRepository");
const notificationRepository = require("../repositories/notificationRepository");

/**
 * Service orchestrating all Administrative HR operations.
 * Operations accept options parameter to support atomic MongoDB transactions sessions.
 */
class AdminService {
  /**
   * Fetch counts for HR Admin Dashboard widget counters.
   */
  async getAdminStats() {
    const totalHeadcount = await userRepository.findPaginated({ isActive: true }, { limit: 1 }).then((r) => r.total);
    const departmentsCount = await departmentRepository.findAll().then((r) => r.length);
    const leaveTypesCount = await leaveTypeRepository.findAll().then((r) => r.length);
    const holidaysCount = await holidayRepository.findAll().then((r) => r.length);
    
    // Count active leaves today
    const todayStr = new Date().toISOString().split("T")[0];
    const activeLeavesCount = await leaveRequestRepository.findActiveOverlapsGlobal(todayStr, todayStr).then((r) => r.length);

    // Count pending approvals
    const pendingReviewsCount = await leaveRequestRepository.findHistoryGlobal({ status: "Pending", limit: 1000 }).then((r) => r.total);

    // Calculate monthly bounds
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Count approved leaves this month
    const approvedThisMonth = await leaveRequestRepository.findHistoryGlobal({ status: "Approved", limit: 10000 })
      .then((r) => r.items.filter((l) => l.reviewedAt && new Date(l.reviewedAt) >= startOfMonth).length);

    // Count leaves starting this month
    const leavesThisMonth = await leaveRequestRepository.findHistoryGlobal({ limit: 10000 })
      .then((r) => r.items.filter((l) => new Date(l.startDate) >= startOfMonth).length);

    return {
      totalHeadcount,
      departmentsCount,
      leaveTypesCount,
      holidaysCount,
      activeLeavesCount,
      onLeaveTodayCount: activeLeavesCount,
      pendingReviewsCount,
      approvedThisMonth,
      leavesThisMonth,
    };
  }

  /**
   * Retrieves paginated, filtered employee directory roster lists.
   */
  async getEmployees(options = {}) {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 10;
    const search = options.search;
    const department = options.department;
    const role = options.role;

    const query = { isActive: true }; // Filter soft-deleted accounts

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (department) {
      query.department = new RegExp(`^${department.trim()}$`, "i");
    }

    if (role) {
      query.role = new RegExp(`^${role.trim()}$`, "i");
    }

    const { items, total } = await userRepository.findPaginated(query, {
      page,
      limit,
      sortBy: "employeeId",
      sortOrder: "asc",
    });

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data: items.map((e) => ({
        id: e.employeeId,
        employeeId: e.employeeId,
        name: e.name,
        email: e.email,
        role: e.role,
        department: e.department,
        designation: e.designation,
        phone: e.phone || "",
        managerId: e.managerId || null,
        emailAlerts: e.emailAlerts ?? true,
        smsAlerts: e.smsAlerts ?? false,
        pushAlerts: e.pushAlerts ?? false,
        avatar: e.name.split(" ").map((n) => n[0]).join("").toUpperCase(),
      })),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Fetch single employee profile document.
   */
  async getEmployeeById(employeeId) {
    const employee = await userRepository.findByEmployeeId(employeeId);
    if (!employee) {
      throw new Error("Employee profile not found.");
    }
    return employee;
  }

  /**
   * Create a new employee record and seeds available leave balances.
   */
  async createEmployee(employeeData, adminUser, options = {}) {
    const { name, email, role, department, designation, managerId, phone } = employeeData;

    // 1. Verify email unique
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new Error("An employee account with this email address already exists.");
    }

    // 2. Hash default credentials
    const defaultPassword = "Password123";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    const customEmployeeId = `EMP-${Math.floor(10000 + Math.random() * 90000)}`;

    let parsedManagerId = managerId ? String(managerId).trim() : null;
    if (parsedManagerId) {
      const match = parsedManagerId.match(/\((MGR-\d+|EMP-\d+|ADM-\d+)\)/i);
      if (match) {
        parsedManagerId = match[1].toUpperCase();
      }
    }

    const userPayload = {
      employeeId: customEmployeeId,
      name,
      email,
      passwordHash,
      role: role || "employee",
      department,
      designation,
      managerId: parsedManagerId || null,
      phone: phone || "",
      isActive: true,
    };

    // 3. Create User profile record
    const created = await userRepository.create(userPayload, options);

    // 4. Seed available Leave Balances ledger using policy configurations
    const leaveTypes = await leaveTypeRepository.findAll({});
    const balances = leaveTypes.length > 0
      ? leaveTypes.map((lt) => ({
          type: lt.type,
          total: lt.annualLimit,
          used: 0,
          available: lt.annualLimit,
        }))
      : [
          { type: "Annual", total: 15, used: 0, available: 15 },
          { type: "Sick", total: 10, used: 0, available: 10 },
          { type: "Casual", total: 8, used: 0, available: 8 },
        ];

    const balanceDoc = {
      employeeId: customEmployeeId,
      balances,
    };

    await leaveBalanceRepository.save(balanceDoc, options);

    // 5. Create System AuditLog entry
    await auditLogRepository.createLog({
      performedBy: adminUser.employeeId,
      role: "hr_admin",
      action: "EMPLOYEE_CREATED",
      details: `Created user profile ${customEmployeeId} (${name}) and seeded leave balances`,
      ipAddress: adminUser.ip,
      userAgent: adminUser.userAgent,
    }, options);

    // 6. Dispath Welcome alert notification for employee
    await notificationRepository.createNotification({
      employeeId: customEmployeeId,
      title: "Welcome to Acme Corp!",
      message: `Your account was successfully registered. Use email: ${email} and Password: ${defaultPassword} to login.`,
      type: "SystemAlert",
    }, options);

    return created;
  }

  /**
   * Edit profile properties of employee.
   */
  async updateEmployee(employeeId, employeeData, adminUser, options = {}) {
    const employee = await userRepository.findByEmployeeId(employeeId);
    if (!employee) {
      throw new Error("Employee profile not found.");
    }

    const { name, email, department, designation, managerId, phone } = employeeData;
    
    let parsedManagerId = managerId ? String(managerId).trim() : null;
    if (parsedManagerId) {
      const match = parsedManagerId.match(/\((MGR-\d+|EMP-\d+|ADM-\d+)\)/i);
      if (match) {
        parsedManagerId = match[1].toUpperCase();
      }
    }

    const updateData = { name, email, department, designation, managerId: parsedManagerId, phone };

    const updated = await userRepository.updateProfile(employeeId, updateData, options);

    await auditLogRepository.createLog({
      performedBy: adminUser.employeeId,
      role: "hr_admin",
      action: "EMPLOYEE_UPDATED",
      details: `Updated details of employee profile: ${employeeId}`,
      ipAddress: adminUser.ip,
      userAgent: adminUser.userAgent,
    }, options);

    return updated;
  }

  /**
   * Soft deletes employee profile.
   */
  async softDeleteEmployee(employeeId, adminUser, options = {}) {
    const employee = await userRepository.findByEmployeeId(employeeId);
    if (!employee) {
      throw new Error("Employee profile not found.");
    }

    await userRepository.updateProfile(employeeId, { isActive: false }, options);

    await auditLogRepository.createLog({
      performedBy: adminUser.employeeId,
      role: "hr_admin",
      action: "EMPLOYEE_DELETED",
      details: `Soft-Deleted employee account: ${employeeId}`,
      ipAddress: adminUser.ip,
      userAgent: adminUser.userAgent,
    }, options);

    return true;
  }

  /**
   * Restores soft-deleted employee profile.
   */
  async restoreEmployee(employeeId, adminUser, options = {}) {
    const employee = await userRepository.findByEmployeeId(employeeId);
    if (!employee) {
      throw new Error("Employee profile not found.");
    }

    await userRepository.updateProfile(employeeId, { isActive: true }, options);

    await auditLogRepository.createLog({
      performedBy: adminUser.employeeId,
      role: "hr_admin",
      action: "EMPLOYEE_RESTORED",
      details: `Restored soft-deleted employee account: ${employeeId}`,
      ipAddress: adminUser.ip,
      userAgent: adminUser.userAgent,
    }, options);

    return true;
  }

  /**
   * Updates user role credentials.
   */
  async updateRole(employeeId, role, adminUser, options = {}) {
    const employee = await userRepository.findByEmployeeId(employeeId);
    if (!employee) {
      throw new Error("Employee profile not found.");
    }

    const updated = await userRepository.updateProfile(employeeId, { role }, options);

    await auditLogRepository.createLog({
      performedBy: adminUser.employeeId,
      role: "hr_admin",
      action: "ROLE_UPDATED",
      details: `Modified access role of user ${employeeId} to: ${role}`,
      ipAddress: adminUser.ip,
      userAgent: adminUser.userAgent,
    }, options);

    await notificationRepository.createNotification({
      employeeId,
      title: "Security Permissions Role Updated",
      message: `Your account role was modified to: ${role}. Please log out and log back in to refresh.`,
      type: "SystemAlert",
    }, options);

    return updated;
  }

  // ----------------------------------------------------
  // Department Management
  // ----------------------------------------------------
  async getDepartments(options = {}) {
    return departmentRepository.findAll({});
  }

  async createDepartment(deptData, adminUser, options = {}) {
    const existing = await departmentRepository.findByName(deptData.name);
    if (existing) throw new Error("A department with this name already exists.");

    const created = await departmentRepository.create(deptData, options);

    await auditLogRepository.createLog({
      performedBy: adminUser.employeeId,
      role: "hr_admin",
      action: "DEPARTMENT_CREATED",
      details: `Created corporate Department: ${deptData.name}`,
      ipAddress: adminUser.ip,
      userAgent: adminUser.userAgent,
    }, options);

    return created;
  }

  async updateDepartment(id, deptData, adminUser, options = {}) {
    const updated = await departmentRepository.update(id, deptData, options);
    if (!updated) throw new Error("Department not found.");

    await auditLogRepository.createLog({
      performedBy: adminUser.employeeId,
      role: "hr_admin",
      action: "DEPARTMENT_UPDATED",
      details: `Updated details for Department ID: ${id}`,
      ipAddress: adminUser.ip,
      userAgent: adminUser.userAgent,
    }, options);

    return updated;
  }

  async deleteDepartment(id, adminUser, options = {}) {
    const deleted = await departmentRepository.delete(id, options);
    if (!deleted) throw new Error("Department not found.");

    await auditLogRepository.createLog({
      performedBy: adminUser.employeeId,
      role: "hr_admin",
      action: "DEPARTMENT_DELETED",
      details: `Deleted Department: ${deleted.name}`,
      ipAddress: adminUser.ip,
      userAgent: adminUser.userAgent,
    }, options);

    return true;
  }

  // ----------------------------------------------------
  // Leave Types Management
  // ----------------------------------------------------
  async getLeaveTypes(options = {}) {
    return leaveTypeRepository.findAll({});
  }

  async createLeaveType(data, adminUser, options = {}) {
    const existing = await leaveTypeRepository.findByType(data.type);
    if (existing) throw new Error("A leave type with this category name already exists.");

    const created = await leaveTypeRepository.create(data, options);

    await auditLogRepository.createLog({
      performedBy: adminUser.employeeId,
      role: "hr_admin",
      action: "LEAVETYPE_CREATED",
      details: `Created leave type policy: ${data.type} (limits: ${data.annualLimit} days)`,
      ipAddress: adminUser.ip,
      userAgent: adminUser.userAgent,
    }, options);

    return created;
  }

  async updateLeaveType(id, data, adminUser, options = {}) {
    const updated = await leaveTypeRepository.update(id, data, options);
    if (!updated) throw new Error("Leave type policy not found.");

    await auditLogRepository.createLog({
      performedBy: adminUser.employeeId,
      role: "hr_admin",
      action: "LEAVETYPE_UPDATED",
      details: `Updated leave type policy: ${updated.type}`,
      ipAddress: adminUser.ip,
      userAgent: adminUser.userAgent,
    }, options);

    return updated;
  }

  async deleteLeaveType(id, adminUser, options = {}) {
    const deleted = await leaveTypeRepository.delete(id, options);
    if (!deleted) throw new Error("Leave type policy not found.");

    await auditLogRepository.createLog({
      performedBy: adminUser.employeeId,
      role: "hr_admin",
      action: "LEAVETYPE_DELETED",
      details: `Deleted leave type policy: ${deleted.type}`,
      ipAddress: adminUser.ip,
      userAgent: adminUser.userAgent,
    }, options);

    return true;
  }

  // ----------------------------------------------------
  // Holiday Management
  // ----------------------------------------------------
  async getHolidays(options = {}) {
    return holidayRepository.findAll({});
  }

  async createHoliday(data, adminUser, options = {}) {
    const existing = await holidayRepository.findByDate(data.date);
    if (existing) throw new Error(`A holiday is already registered on this date: ${data.date}`);

    const created = await holidayRepository.create(data, options);

    // Notify all active users of the new holiday
    const activeUsers = await userRepository.findPaginated({ isActive: true }, { limit: 10000 });
    if (activeUsers && activeUsers.items.length > 0) {
      const notifications = activeUsers.items.map((u) => ({
        employeeId: u.employeeId,
        title: "New Holiday Added",
        message: `A new holiday "${data.name}" has been registered on ${data.date}.`,
        type: "HolidayAlert",
      }));
      await notificationRepository.createNotification(notifications);
    }

    await auditLogRepository.createLog({
      performedBy: adminUser.employeeId,
      role: "hr_admin",
      action: "HOLIDAY_CREATED",
      details: `Created holiday event ${data.name} on date ${data.date}`,
      ipAddress: adminUser.ip,
      userAgent: adminUser.userAgent,
    }, options);

    return created;
  }

  async updateHoliday(id, data, adminUser, options = {}) {
    const updated = await holidayRepository.update(id, data, options);
    if (!updated) throw new Error("Holiday record not found.");

    await auditLogRepository.createLog({
      performedBy: adminUser.employeeId,
      role: "hr_admin",
      action: "HOLIDAY_UPDATED",
      details: `Updated details of Holiday ${updated.name}`,
      ipAddress: adminUser.ip,
      userAgent: adminUser.userAgent,
    }, options);

    return updated;
  }

  async deleteHoliday(id, adminUser, options = {}) {
    const deleted = await holidayRepository.delete(id, options);
    if (!deleted) throw new Error("Holiday record not found.");

    await auditLogRepository.createLog({
      performedBy: adminUser.employeeId,
      role: "hr_admin",
      action: "HOLIDAY_DELETED",
      details: `Removed Holiday event ${deleted.name} on date ${deleted.date}`,
      ipAddress: adminUser.ip,
      userAgent: adminUser.userAgent,
    }, options);

    return true;
  }

  // ----------------------------------------------------
  // Audit Logs Management
  // ----------------------------------------------------
  async getAuditLogs(options = {}) {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 10;
    const search = options.search;

    const query = {};
    if (search && search.trim()) {
      query.$or = [
        { performedBy: { $regex: search.trim(), $options: "i" } },
        { action: { $regex: search.trim(), $options: "i" } },
        { details: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Reuse query isolation using standard Schema imports
    const AuditLog = require("../models/AuditLog");
    const total = await AuditLog.countDocuments(query);
    const items = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data: items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  // ----------------------------------------------------
  // Global Settings Management
  // ----------------------------------------------------
  async getSettings() {
    return settingsRepository.getSettings();
  }

  async updateSettings(data, adminUser, options = {}) {
    const updated = await settingsRepository.updateSettings(data, options);

    await auditLogRepository.createLog({
      performedBy: adminUser.employeeId,
      role: "hr_admin",
      action: "SETTINGS_UPDATED",
      details: `Updated global organization settings configurations`,
      ipAddress: adminUser.ip,
      userAgent: adminUser.userAgent,
    }, options);

    return updated;
  }
}

module.exports = new AdminService();
