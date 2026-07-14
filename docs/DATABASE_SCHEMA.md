# Database Schema Specification

This document details the MongoDB schema, collection structures, relational references, indexing policies, and validation rules for the Employee Leave Management System.

---

## 📊 Database Collections Map

We model the database using **Mongoose** schemas inside the Node.js Express backend:

```
  ┌─────────────────┐
  │      User       │
  └────────┬────────┘
           │ (1-to-Many)
           ├─────────────────────────┐
           ▼                         ▼
  ┌─────────────────┐       ┌─────────────────┐
  │  LeaveRequest   │       │  LeaveBalance   │
  └─────────────────┘       └─────────────────┘
```

---

## 🗄️ Collections Schema Definitions

### 1. `users` Collection
Stores credential logs, profiles info, and role-based permissions access scopes.

```javascript
{
  _id: ObjectId,
  employeeId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["employee", "manager", "hr_admin"], default: "employee" },
  department: { type: String, required: true, index: true },
  designation: { type: String, required: true },
  managerId: { type: String, default: null, index: true }, // References employeeId of direct manager
  isActive: { type: Boolean, default: true },
  createdAt: Date,
  updatedAt: Date
}
```
* **Indexes**: 
  * `employeeId: 1` (Unique index for profile identification)
  * `email: 1` (Unique index for authentication lookup speed)
  * `managerId: 1` (For fetching team members list query speed)

---

### 2. `leave_requests` Collection
Tracks submitted leave requests, durations, validation states, and reviews remark histories.

```javascript
{
  _id: ObjectId,
  id: { type: String, required: true, unique: true, index: true }, // Format e.g., 'LV-102'
  employeeId: { type: String, required: true, ref: "User.employeeId", index: true },
  employeeName: { type: String, required: true },
  leaveType: { type: String, enum: ["Annual", "Sick", "Casual", "Maternity", "Paternity"], required: true },
  startDate: { type: String, required: true }, // Format 'YYYY-MM-DD'
  endDate: { type: String, required: true }, // Format 'YYYY-MM-DD'
  totalDays: { type: Number, required: true },
  workingDays: { type: Number, required: true },
  reason: { type: String, required: true, minlength: 10 },
  status: { type: String, enum: ["Pending", "Approved", "Rejected", "Cancelled"], default: "Pending", index: true },
  reviewer: { type: String, default: null }, // Manager identifier who reviewed last
  reviewedAt: { type: Date, default: null },
  remarks: { type: String, default: null },
  attachment: { type: String, default: null }, // URL file string path
  
  // Multi-stage approval metadata
  currentStage: { type: Number, default: 1 },
  totalStages: { type: Number, default: 1 },
  approvedBy: [{ type: String }],
  rejectedBy: { type: String, default: null },
  
  createdAt: Date,
  updatedAt: Date
}
```
* **Indexes**:
  * `id: 1` (Unique log retrieval index)
  * `employeeId: 1` (Fast query of employee history records)
  * `status: 1` (Filter reviews queues efficiently)
  * `startDate: -1` (For descending chronological sorts)

---

### 3. `leave_balances` Collection
Maintains leave budgets limits and active allowances counters for each employee.

```javascript
{
  _id: ObjectId,
  employeeId: { type: String, required: true, ref: "User.employeeId", unique: true, index: true },
  balances: [
    {
      type: { type: String, required: true },
      total: { type: Number, required: true },
      used: { type: Number, required: true, default: 0 },
      available: { type: Number, required: true }
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```
* **Validation Rules**:
  * `available` must always equal `total - used`.
  * `available` cannot fall below `0`.

---

### 4. `announcements` Collection
Stores organization-wide alerts and guidelines alerts.

```javascript
{
  _id: ObjectId,
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: String, required: true },
  urgent: { type: Boolean, default: false },
  createdAt: Date,
  updatedAt: Date
}
```
