import { LEAVE_STATUS } from "@/constants/dashboard";

/**
 * Mock Team Members under Manager MGR-20015 (Sarah Hansen).
 *
 * @type {Array<Object>}
 */
export const MOCK_TEAM_MEMBERS = [
  {
    id: "EMP-10024",
    name: "John Doe",
    role: "Software Engineer",
    avatar: "JD",
    email: "john.doe@company.com",
    department: "Engineering",
    designation: "Senior Developer",
    manager: "Sarah Hansen (MGR-20015)",
    balances: [
      { type: "Annual", total: 15, used: 3, available: 12 },
      { type: "Sick", total: 10, used: 2, available: 8 },
      { type: "Casual", total: 8, used: 4, available: 4 },
    ],
    leavesHistory: [
      { id: "LV-098", type: "Sick", startDate: "2026-06-10", endDate: "2026-06-11", status: LEAVE_STATUS.APPROVED, days: 1 },
      { id: "LV-085", type: "Casual", startDate: "2026-05-02", endDate: "2026-05-03", status: LEAVE_STATUS.REJECTED, days: 2 },
    ],
    upcomingHolidays: [
      { name: "Labor Day", date: "2026-09-07" },
    ],
  },
  {
    id: "EMP-10025",
    name: "Alice Smith",
    role: "UI/UX Designer",
    avatar: "AS",
    email: "alice.smith@company.com",
    department: "Product & UI",
    designation: "Lead Visual Designer",
    manager: "Sarah Hansen (MGR-20015)",
    balances: [
      { type: "Annual", total: 18, used: 5, available: 13 },
      { type: "Sick", total: 10, used: 1, available: 9 },
      { type: "Casual", total: 8, used: 2, available: 6 },
    ],
    leavesHistory: [
      { id: "LV-080", type: "Annual", startDate: "2026-05-15", endDate: "2026-05-18", status: LEAVE_STATUS.APPROVED, days: 3 },
    ],
    upcomingHolidays: [
      { name: "Labor Day", date: "2026-09-07" },
    ],
  },
  {
    id: "EMP-10026",
    name: "Bob Johnson",
    role: "QA Test Engineer",
    avatar: "BJ",
    email: "bob.johnson@company.com",
    department: "Engineering",
    designation: "QA Engineer",
    manager: "Sarah Hansen (MGR-20015)",
    balances: [
      { type: "Annual", total: 15, used: 4, available: 11 },
      { type: "Sick", total: 10, used: 3, available: 7 },
      { type: "Casual", total: 8, used: 0, available: 8 },
    ],
    leavesHistory: [],
    upcomingHolidays: [
      { name: "Labor Day", date: "2026-09-07" },
    ],
  },
  {
    id: "EMP-10027",
    name: "Emma Watson",
    role: "Backend Architect",
    avatar: "EW",
    email: "emma.watson@company.com",
    department: "Engineering",
    designation: "Senior Architect",
    manager: "Sarah Hansen (MGR-20015)",
    balances: [
      { type: "Annual", total: 20, used: 2, available: 18 },
      { type: "Sick", total: 12, used: 0, available: 12 },
      { type: "Casual", total: 8, used: 1, available: 7 },
    ],
    leavesHistory: [],
    upcomingHolidays: [
      { name: "Labor Day", date: "2026-09-07" },
    ],
  },
];

/**
 * Mock Approvals list with Multi-level Approvals structures.
 *
 * @type {Array<Object>}
 */
export const MOCK_APPROVALS = [
  {
    id: "LV-102",
    employeeId: "EMP-10024",
    employeeName: "John Doe",
    avatar: "JD",
    role: "Software Engineer",
    leaveType: "Annual",
    startDate: "2026-07-15",
    endDate: "2026-07-20",
    totalDays: 6,
    workingDays: 4,
    reason: "Summer family trip to national park.",
    status: LEAVE_STATUS.PENDING,
    appliedAt: "2026-07-08T10:00:00Z",
    reviewer: null,
    reviewedAt: null,
    remarks: null,
    attachment: "vacation-itinerary.pdf",
    
    // Multi-level approval fields mapping
    currentStage: 1,
    totalStages: 1,
    approvedBy: [],
    rejectedBy: null,
  },
  {
    id: "LV-105",
    employeeId: "EMP-10025",
    employeeName: "Alice Smith",
    avatar: "AS",
    role: "UI/UX Designer",
    leaveType: "Sick",
    startDate: "2026-07-12",
    endDate: "2026-07-13",
    totalDays: 2,
    workingDays: 1,
    reason: "Dental operation surgery recovery.",
    status: LEAVE_STATUS.APPROVED,
    appliedAt: "2026-07-09T08:00:00Z",
    reviewer: "Sarah Hansen (MGR-20015)",
    reviewedAt: "2026-07-10T14:30:00Z",
    remarks: "Medical requirement approved.",
    attachment: "dental-cert.jpg",
    
    currentStage: 1,
    totalStages: 1,
    approvedBy: ["Sarah Hansen (MGR-20015)"],
    rejectedBy: null,
  },
  {
    id: "LV-106",
    employeeId: "EMP-10026",
    employeeName: "Bob Johnson",
    avatar: "BJ",
    role: "QA Test Engineer",
    leaveType: "Casual",
    startDate: "2026-07-18",
    endDate: "2026-07-19",
    totalDays: 2,
    workingDays: 1,
    reason: "Personal urgent banking files signature.",
    status: LEAVE_STATUS.PENDING,
    appliedAt: "2026-07-11T12:00:00Z",
    reviewer: null,
    reviewedAt: null,
    remarks: null,
    attachment: null,
    
    currentStage: 1,
    totalStages: 1,
    approvedBy: [],
    rejectedBy: null,
  },
  {
    id: "LV-107",
    employeeId: "EMP-10027",
    employeeName: "Emma Watson",
    avatar: "EW",
    role: "Backend Architect",
    leaveType: "Annual",
    startDate: "2026-07-25",
    endDate: "2026-07-27",
    totalDays: 3,
    workingDays: 2,
    reason: "Attending technical conference as speaker.",
    status: LEAVE_STATUS.PENDING,
    appliedAt: "2026-07-10T09:15:00Z",
    reviewer: null,
    reviewedAt: null,
    remarks: null,
    attachment: "conference-invitation.pdf",
    
    currentStage: 1,
    totalStages: 2, // Requires 2 levels (Manager + HR)
    approvedBy: [],
    rejectedBy: null,
  },
];

/**
 * Mock Notification list records.
 *
 * @type {Array<Object>}
 */
export const MOCK_NOTIFICATIONS = [
  { id: "notif-10", text: "New leave request LV-102 submitted by John Doe.", read: false, time: "2 hours ago" },
  { id: "notif-11", text: "Leave request LV-105 from Alice Smith is pending approval.", read: false, time: "4 hours ago" },
];

/**
 * Analytics Mocks datasets for utilization trends.
 */
export const MOCK_ANALYTICS = {
  monthlyLeaveTrend: [
    { month: "Jan", days: 12 },
    { month: "Feb", days: 8 },
    { month: "Mar", days: 15 },
    { month: "Apr", days: 22 },
    { month: "May", days: 18 },
    { month: "Jun", days: 25 },
    { month: "Jul", days: 30 },
  ],
  leaveTypeDistribution: [
    { type: "Annual", percentage: 55 },
    { type: "Sick", percentage: 25 },
    { type: "Casual", percentage: 20 },
  ],
  departmentUtilization: [
    { name: "Engineering", percentage: 78 },
    { name: "Product & UI", percentage: 65 },
    { name: "Human Resources", percentage: 40 },
  ],
};
