import { DUMMY_USERS } from "@/data/dummyUser";
import { LEAVE_STATUS } from "@/constants/dashboard";

// Simulation storage for leaves list matching global dashboard values
let mockLeavesDatabase = [
  {
    id: "LV-102",
    employeeId: "EMP-10024",
    leaveType: "Annual",
    startDate: "2026-07-15",
    endDate: "2026-07-20",
    totalDays: 6,
    workingDays: 4, // 15, 16, 17, 20 July are weekdays (18, 19 are weekend)
    reason: "Family vacation trip",
    status: LEAVE_STATUS.PENDING,
    attachment: null,
    reviewedBy: null,
    reviewedAt: null,
    createdAt: "2026-07-08T10:00:00Z",
    updatedAt: "2026-07-08T10:00:00Z",
  },
  {
    id: "LV-098",
    employeeId: "EMP-10024",
    leaveType: "Sick",
    startDate: "2026-06-10",
    endDate: "2026-06-11",
    totalDays: 2,
    workingDays: 2,
    reason: "Medical checkup appointment",
    status: LEAVE_STATUS.APPROVED,
    attachment: null,
    reviewedBy: "MGR-20015",
    reviewedAt: "2026-06-11T09:30:00Z",
    createdAt: "2026-06-10T08:00:00Z",
    updatedAt: "2026-06-11T09:30:00Z",
  },
];

let mockBalancesDatabase = {
  "EMP-10024": [
    { type: "Annual", total: 15, used: 3, available: 12 },
    { type: "Sick", total: 10, used: 2, available: 8 },
    { type: "Casual", total: 8, used: 4, available: 4 },
    { type: "Maternity", total: 30, used: 0, available: 30 },
  ],
};

/**
 * Generates a randomized timeout delay between min and max parameters.
 */
const getRandomDelay = (min = 500, max = 900) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Reusable Leave Domain Calculations and Validations.
 */
export const leaveUtils = {
  /**
   * Calculates total calendar days between two dates, inclusive.
   */
  calculateLeaveDuration: (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return 0;
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  },

  /**
   * Calculates total working days, excluding Saturdays and Sundays.
   */
  calculateWorkingDays: (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return 0;
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    let count = 0;
    const curDate = new Date(start.getTime());
    while (curDate <= end) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sunday (0) and Saturday (6)
        count++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  },

  /**
   * Validates date selections.
   * Ensures start date is today or in the future, and end date falls after start.
   */
  validateDates: (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return "Dates are required.";
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return "Start date cannot be in the past.";
    }
    if (end < start) {
      return "End date cannot be before the start date.";
    }
    return null;
  },

  /**
   * Checks if requested leave overlaps with any existing approved/pending leaves.
   */
  checkOverlappingRequests: (existingLeaves, startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr || !existingLeaves) return false;
    return existingLeaves.some((l) => {
      // Overlap formula: (StartA <= EndB) and (EndA >= StartB)
      const overlap = startDateStr <= l.endDate && endDateStr >= l.startDate;
      const isActive = l.status !== LEAVE_STATUS.REJECTED;
      return overlap && isActive;
    });
  },
};

/**
 * Leave Service API simulation layer.
 */
export const leaveService = {
  /**
   * Fetches leave balances for a specific employee.
   */
  getBalances: async (userId) => {
    await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));
    return mockBalancesDatabase[userId] || mockBalancesDatabase["EMP-10024"];
  },

  /**
   * Submits a new leave request. Performs server-side validations.
   */
  submitLeave: async (userId, leaveData) => {
    await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));

    const { leaveType, startDate, endDate, reason } = leaveData;
    const userRole = "employee";

    // 1. Validate dates
    const dateError = leaveUtils.validateDates(startDate, endDate);
    if (dateError) throw new Error(dateError);

    // 2. Validate reason length
    if (!reason || reason.trim().length < 10) {
      throw new Error("Reason must be at least 10 characters long.");
    }

    // 3. Prevent overlaps
    const userLeaves = mockLeavesDatabase.filter((l) => l.employeeId === userId);
    const hasOverlap = leaveUtils.checkOverlappingRequests(userLeaves, startDate, endDate);
    if (hasOverlap) {
      throw new Error("A leave request already overlaps with these selected dates.");
    }

    // 4. Validate balances
    const balances = mockBalancesDatabase[userId] || mockBalancesDatabase["EMP-10024"];
    const targetBalance = balances.find((b) => b.type.toLowerCase() === leaveType.toLowerCase());
    
    if (!targetBalance) {
      throw new Error("Invalid leave type selection.");
    }

    const workingDaysCount = leaveUtils.calculateWorkingDays(startDate, endDate);
    
    if (workingDaysCount > targetBalance.available) {
      throw new Error(`Insufficient balance for ${leaveType} Leave. Available: ${targetBalance.available} days, Requested: ${workingDaysCount} days.`);
    }

    // Deduct available balances locally in mock database
    targetBalance.available -= workingDaysCount;
    targetBalance.used += workingDaysCount;

    // Create backend-matched leave object
    const newRequest = {
      id: `LV-${Math.floor(100 + Math.random() * 900)}`,
      employeeId: userId,
      leaveType,
      startDate,
      endDate,
      totalDays: leaveUtils.calculateLeaveDuration(startDate, endDate),
      workingDays: workingDaysCount,
      reason,
      status: LEAVE_STATUS.PENDING,
      attachment: null,
      reviewedBy: null,
      reviewedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to local list database
    mockLeavesDatabase.push(newRequest);

    return newRequest;
  },

  /**
   * Helper to retrieve all active leaves for an employee.
   */
  getLeavesHistory: async (userId) => {
    await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));
    return mockLeavesDatabase.filter((l) => l.employeeId === userId);
  },
};

export default leaveService;
