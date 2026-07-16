const adminService = require("../services/adminService");

/**
 * Controller orchestrating all Administrative HR requests.
 */
class AdminController {
  // Stats
  async getStats(req, res, next) {
    try {
      const stats = await adminService.getAdminStats();
      res.status(200).json({ success: true, message: "Admin stats retrieved.", data: stats });
    } catch (e) {
      next(e);
    }
  }

  // Employees CRUD
  async getEmployees(req, res, next) {
    try {
      const result = await adminService.getEmployees(req.query);
      res.status(200).json({ success: true, message: "Employee roster fetched.", data: result });
    } catch (e) {
      next(e);
    }
  }

  async getEmployeeById(req, res, next) {
    try {
      const employee = await adminService.getEmployeeById(req.params.id);
      res.status(200).json({ success: true, message: "Employee details fetched.", data: employee });
    } catch (e) {
      next(e);
    }
  }

  async createEmployee(req, res, next) {
    try {
      const adminUser = {
        employeeId: req.user.employeeId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      };
      const created = await adminService.createEmployee(req.body, adminUser);
      res.status(201).json({ success: true, message: "Employee profile created.", data: created });
    } catch (e) {
      next(e);
    }
  }

  async updateEmployee(req, res, next) {
    try {
      const adminUser = {
        employeeId: req.user.employeeId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      };
      const updated = await adminService.updateEmployee(req.params.id, req.body, adminUser);
      res.status(200).json({ success: true, message: "Employee profile updated.", data: updated });
    } catch (e) {
      next(e);
    }
  }

  async softDeleteEmployee(req, res, next) {
    try {
      const adminUser = {
        employeeId: req.user.employeeId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      };
      await adminService.softDeleteEmployee(req.params.id, adminUser);
      res.status(200).json({ success: true, message: "Employee soft-deleted successfully." });
    } catch (e) {
      next(e);
    }
  }

  async restoreEmployee(req, res, next) {
    try {
      const adminUser = {
        employeeId: req.user.employeeId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      };
      await adminService.restoreEmployee(req.params.id, adminUser);
      res.status(200).json({ success: true, message: "Employee restored successfully." });
    } catch (e) {
      next(e);
    }
  }

  async updateRole(req, res, next) {
    try {
      const adminUser = {
        employeeId: req.user.employeeId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      };
      const updated = await adminService.updateRole(req.params.id, req.body.role, adminUser);
      res.status(200).json({ success: true, message: "Employee role updated.", data: updated });
    } catch (e) {
      next(e);
    }
  }

  // Department CRUD
  async getDepartments(req, res, next) {
    try {
      const list = await adminService.getDepartments(req.query);
      res.status(200).json({ success: true, message: "Departments list fetched.", data: list });
    } catch (e) {
      next(e);
    }
  }

  async createDepartment(req, res, next) {
    try {
      const adminUser = {
        employeeId: req.user.employeeId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      };
      const created = await adminService.createDepartment(req.body, adminUser);
      res.status(201).json({ success: true, message: "Department created.", data: created });
    } catch (e) {
      next(e);
    }
  }

  async updateDepartment(req, res, next) {
    try {
      const adminUser = {
        employeeId: req.user.employeeId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      };
      const updated = await adminService.updateDepartment(req.params.id, req.body, adminUser);
      res.status(200).json({ success: true, message: "Department updated.", data: updated });
    } catch (e) {
      next(e);
    }
  }

  async deleteDepartment(req, res, next) {
    try {
      const adminUser = {
        employeeId: req.user.employeeId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      };
      await adminService.deleteDepartment(req.params.id, adminUser);
      res.status(200).json({ success: true, message: "Department deleted." });
    } catch (e) {
      next(e);
    }
  }

  // LeaveTypes CRUD
  async getLeaveTypes(req, res, next) {
    try {
      const list = await adminService.getLeaveTypes(req.query);
      res.status(200).json({ success: true, message: "Leave types list fetched.", data: list });
    } catch (e) {
      next(e);
    }
  }

  async createLeaveType(req, res, next) {
    try {
      const adminUser = {
        employeeId: req.user.employeeId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      };
      const created = await adminService.createLeaveType(req.body, adminUser);
      res.status(201).json({ success: true, message: "Leave type policy created.", data: created });
    } catch (e) {
      next(e);
    }
  }

  async updateLeaveType(req, res, next) {
    try {
      const adminUser = {
        employeeId: req.user.employeeId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      };
      const updated = await adminService.updateLeaveType(req.params.id, req.body, adminUser);
      res.status(200).json({ success: true, message: "Leave type policy updated.", data: updated });
    } catch (e) {
      next(e);
    }
  }

  async deleteLeaveType(req, res, next) {
    try {
      const adminUser = {
        employeeId: req.user.employeeId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      };
      await adminService.deleteLeaveType(req.params.id, adminUser);
      res.status(200).json({ success: true, message: "Leave type policy deleted." });
    } catch (e) {
      next(e);
    }
  }

  // Holiday CRUD
  async getHolidays(req, res, next) {
    try {
      const list = await adminService.getHolidays(req.query);
      res.status(200).json({ success: true, message: "Holidays list fetched.", data: list });
    } catch (e) {
      next(e);
    }
  }

  async createHoliday(req, res, next) {
    try {
      const adminUser = {
        employeeId: req.user.employeeId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      };
      const created = await adminService.createHoliday(req.body, adminUser);
      res.status(201).json({ success: true, message: "Holiday created.", data: created });
    } catch (e) {
      next(e);
    }
  }

  async updateHoliday(req, res, next) {
    try {
      const adminUser = {
        employeeId: req.user.employeeId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      };
      const updated = await adminService.updateHoliday(req.params.id, req.body, adminUser);
      res.status(200).json({ success: true, message: "Holiday updated.", data: updated });
    } catch (e) {
      next(e);
    }
  }

  async deleteHoliday(req, res, next) {
    try {
      const adminUser = {
        employeeId: req.user.employeeId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      };
      await adminService.deleteHoliday(req.params.id, adminUser);
      res.status(200).json({ success: true, message: "Holiday deleted." });
    } catch (e) {
      next(e);
    }
  }

  // Audits
  async getAuditLogs(req, res, next) {
    try {
      const result = await adminService.getAuditLogs(req.query);
      res.status(200).json({ success: true, message: "Audit logs fetched.", data: result });
    } catch (e) {
      next(e);
    }
  }

  // Settings
  async getSettings(req, res, next) {
    try {
      const settings = await adminService.getSettings();
      res.status(200).json({ success: true, message: "Settings fetched.", data: settings });
    } catch (e) {
      next(e);
    }
  }

  async updateSettings(req, res, next) {
    try {
      const adminUser = {
        employeeId: req.user.employeeId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      };
      const updated = await adminService.updateSettings(req.body, adminUser);
      res.status(200).json({ success: true, message: "Settings updated.", data: updated });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AdminController();
