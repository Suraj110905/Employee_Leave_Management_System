import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import Topbar from "@/components/layout/Topbar";
import Footer from "@/components/layout/Footer";
import PageContainer from "@/components/layout/PageContainer";
import {
  employeeNavigation,
  managerNavigation,
  adminNavigation,
} from "@/config/navigation";
import { ROLES } from "@/constants/roles";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Add actual logout logic (clear session/token/context)
    navigate("/");
  };

  // Determine role and navigation items based on current path prefix
  const pathname = location.pathname;
  let role = ROLES.EMPLOYEE;
  let navItems = employeeNavigation;
  let roleTitle = "Employee Panel";
  let userRoleLabel = "Software Engineer";
  let userName = "John Doe";
  let userInitial = "JD";

  if (pathname.startsWith("/admin")) {
    role = ROLES.HR_ADMIN;
    navItems = adminNavigation;
    roleTitle = "HR Administration";
    userRoleLabel = "HR Specialist";
    userName = "Admin User";
    userInitial = "AD";
  } else if (pathname.startsWith("/manager")) {
    role = ROLES.MANAGER;
    navItems = managerNavigation;
    roleTitle = "Manager Panel";
    userRoleLabel = "Engineering Manager";
    userName = "Sarah Hansen";
    userInitial = "SH";
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Desktop Sidebar */}
      <Sidebar
        items={navItems}
        role={role}
        onLogout={handleLogout}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        items={navItems}
        role={role}
        onLogout={handleLogout}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        {/* Shared Top Navigation Bar */}
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          title={roleTitle}
          userName={userName}
          userRole={userRoleLabel}
          userInitial={userInitial}
          role={role}
        />

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 flex flex-col justify-between">
          <PageContainer>
            <Outlet />
          </PageContainer>

          {/* Shared Layout Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
}

