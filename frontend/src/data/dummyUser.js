import { ROLES } from "@/constants/roles";

/**
 * Realistic Mock Datasets for testing.
 * Maps session user parameters to simulated profile roles.
 */
export const DUMMY_USERS = {
  employee: {
    id: "EMP-10024",
    name: "John Doe",
    email: "john.doe@leaveportal.com",
    role: ROLES.EMPLOYEE,
    label: "Software Engineer",
    department: "Engineering",
    avatar: "",
  },
  
  manager: {
    id: "MGR-20015",
    name: "Sarah Hansen",
    email: "sarah.hansen@leaveportal.com",
    role: ROLES.MANAGER,
    label: "Engineering Manager",
    department: "Engineering",
    avatar: "",
  },
  
  hr_admin: {
    id: "ADM-30001",
    name: "Admin User",
    email: "admin@leaveportal.com",
    role: ROLES.HR_ADMIN,
    label: "HR Lead Specialist",
    department: "Human Resources",
    avatar: "",
  },
};

export default DUMMY_USERS;
