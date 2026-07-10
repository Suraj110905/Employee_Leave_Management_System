import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "@/pages/auth/Login";

import EmployeeDashboard from "@/pages/employee/Dashboard";
import ManagerDashboard from "@/pages/manager/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/employee/dashboard"
          element={<EmployeeDashboard />}
        />

        <Route
          path="/manager/dashboard"
          element={<ManagerDashboard />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}