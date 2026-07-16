const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

// Load env configuration
dotenv.config({ path: path.join(__dirname, "../../.env") });

const Role = require("../models/Role");
const Department = require("../models/Department");
const User = require("../models/User");
const LeaveBalance = require("../models/LeaveBalance");
const logger = require("../config/logger");

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/employee-leave-system";
    await mongoose.connect(mongoUri);
    logger.info("Database connected successfully for seeding.");

    // 1. Wipe existing entries
    await Role.deleteMany({});
    await Department.deleteMany({});
    await User.deleteMany({});
    await LeaveBalance.deleteMany({});
    logger.info("Cleared legacy database records.");

    // 2. Seed Roles
    const roles = await Role.insertMany([
      { name: "employee", description: "Standard corporate staff member access" },
      { name: "manager", description: "Line manager department level reviewer access" },
      { name: "hr_admin", description: "Full HR systems administration configuration access" },
    ]);
    logger.info(`Seeded ${roles.length} role permissions.`);

    // 3. Seed Departments
    const departments = await Department.insertMany([
      { name: "Engineering", managerId: "MGR-20015", headcount: 12 },
      { name: "Human Resources", managerId: "MGR-20016", headcount: 3 },
      { name: "Finance", managerId: "MGR-20017", headcount: 4 },
    ]);
    logger.info(`Seeded ${departments.length} company division records.`);

    // 4. Hash Passwords
    const defaultPassword = "Password123";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    // 5. Seed Users
    const seededUsers = await User.insertMany([
      {
        employeeId: "ADM-90001",
        name: "Robert HR Admin",
        email: "admin@company.com",
        passwordHash,
        role: "hr_admin",
        department: "Human Resources",
        designation: "HR Lead Administrator",
        managerId: null,
        isActive: true,
      },
      {
        employeeId: "MGR-20015",
        name: "Mike Manager",
        email: "manager@company.com",
        passwordHash,
        role: "manager",
        department: "Engineering",
        designation: "Software Engineering Director",
        managerId: null,
        isActive: true,
      },
      {
        employeeId: "EMP-10024",
        name: "John Employee",
        email: "employee@company.com",
        passwordHash,
        role: "employee",
        department: "Engineering",
        designation: "Senior Frontend Engineer",
        managerId: "MGR-20015",
        isActive: true,
      },
    ]);
    logger.info(`Seeded ${seededUsers.length} user profiles.`);

    // 6. Seed Leave Balances for employee
    const defaultBalances = [
      {
        employeeId: "EMP-10024",
        balances: [
          { type: "Annual", total: 15, used: 3, available: 12 },
          { type: "Sick", total: 10, used: 2, available: 8 },
          { type: "Casual", total: 8, used: 4, available: 4 },
        ],
      },
      {
        employeeId: "MGR-20015",
        balances: [
          { type: "Annual", total: 18, used: 2, available: 16 },
          { type: "Sick", total: 10, used: 1, available: 9 },
          { type: "Casual", total: 8, used: 2, available: 6 },
        ],
      },
    ];
    await LeaveBalance.insertMany(defaultBalances);
    logger.info("Seeded initial employee leave allowances registers.");

    logger.info("Database seeding lifecycle completed successfully.");
    process.exit(0);
  } catch (error) {
    logger.error(`CRITICAL seeder failure: ${error.message}`);
    process.exit(1);
  }
};

seedData();
