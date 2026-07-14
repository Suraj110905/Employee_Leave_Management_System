import { LEAVE_STATUS } from "@/constants/dashboard";

/**
 * Mock Database collection for active employee profile logs.
 *
 * @type {Array<Object>}
 */
export let MOCK_EMPLOYEES_DB = [
  {
    id: "EMP-10024",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "employee",
    department: "Engineering",
    designation: "Senior Developer",
    manager: "Sarah Hansen (MGR-20015)",
    isActive: true,
  },
  {
    id: "EMP-10025",
    name: "Alice Smith",
    email: "alice.smith@company.com",
    role: "employee",
    department: "Product & UI",
    designation: "Lead UI Designer",
    manager: "Sarah Hansen (MGR-20015)",
    isActive: true,
  },
  {
    id: "MGR-20015",
    name: "Sarah Hansen",
    email: "sarah.hansen@company.com",
    role: "manager",
    department: "Engineering",
    designation: "Engineering Manager",
    manager: "Dave Miller (MGR-20016)",
    isActive: true,
  },
  {
    id: "ADM-30044",
    name: "Clara Croft",
    email: "clara.croft@company.com",
    role: "hr_admin",
    department: "Human Resources",
    designation: "HR Lead Director",
    manager: null,
    isActive: true,
  },
];

/**
 * Mock Database collection for active leave type policies rules.
 *
 * @type {Array<Object>}
 */
export let MOCK_LEAVE_TYPES_DB = [
  { id: "LT-01", type: "Annual", annualLimit: 15, carryForward: true, genderPolicy: "All" },
  { id: "LT-02", type: "Sick", annualLimit: 10, carryForward: false, genderPolicy: "All" },
  { id: "LT-03", type: "Casual", annualLimit: 8, carryForward: false, genderPolicy: "All" },
  { id: "LT-04", type: "Maternity", annualLimit: 90, carryForward: false, genderPolicy: "Female Only" },
  { id: "LT-05", type: "Paternity", annualLimit: 15, carryForward: false, genderPolicy: "Male Only" },
];

/**
 * Mock Database collection for organization departments headcounts and managers mappings.
 *
 * @type {Array<Object>}
 */
export let MOCK_DEPARTMENTS_DB = [
  { id: "DEPT-01", name: "Engineering", headcount: 18, manager: "Sarah Hansen (MGR-20015)" },
  { id: "DEPT-02", name: "Product & UI", headcount: 7, manager: "Dave Miller (MGR-20016)" },
  { id: "DEPT-03", name: "Human Resources", headcount: 4, manager: "Clara Croft (ADM-30044)" },
  { id: "DEPT-04", name: "Operations", headcount: 16, manager: "Marcus Aurelius (MGR-20017)" },
];

/**
 * Mock Database collection for holidays date markers.
 *
 * @type {Array<Object>}
 */
export let MOCK_HOLIDAYS_DB = [
  { id: "HOL-01", name: "New Year's Day", date: "2026-01-01", type: "National" },
  { id: "HOL-02", name: "Independence Day", date: "2026-07-04", type: "National" },
  { id: "HOL-03", name: "Labor Day", date: "2026-09-07", type: "National" },
  { id: "HOL-04", name: "Thanksgiving Day", date: "2026-11-26", type: "National" },
  { id: "HOL-05", name: "Company Anniversary Shutdown", date: "2026-12-24", type: "Company" },
];

/**
 * Mock Database collection for system audit logs entries.
 *
 * @type {Array<Object>}
 */
export let MOCK_AUDIT_LOGS_DB = [
  { timestamp: "2026-07-13T10:00:00Z", actor: "Sarah Hansen (MGR-20015)", action: "Approved Request LV-105", target: "Alice Smith (EMP-10025)", type: "Approval" },
  { timestamp: "2026-07-13T14:20:00Z", actor: "Clara Croft (ADM-30044)", action: "Created Employee profile ADM-30044", target: "Clara Croft", type: "System" },
  { timestamp: "2026-07-13T15:30:00Z", actor: "John Doe (EMP-10024)", action: "Submitted leave request LV-102", target: "John Doe", type: "Apply" },
  { timestamp: "2026-07-13T16:40:00Z", actor: "Dave Miller (MGR-20016)", action: "Rejected leave request LV-085", target: "EMP-10025", type: "Approval" },
];
