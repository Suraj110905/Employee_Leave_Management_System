import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import Topbar from "@/components/layout/Topbar";
import Footer from "@/components/layout/Footer";
import PageContainer from "@/components/layout/PageContainer";

/**
 * Production-ready DashboardLayout component.
 * Integrates reusable Topbar, Sidebar, MobileSidebar, and Footer elements
 * using React Router's <Outlet /> for nested view rendering.
 */
export default function DashboardLayout({
  user = null,
  notifications = [],
  role = "",
  sidebarItems = [],
  onLogout = () => {},
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Resolve dynamic topbar page header depending on active pathname
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/employee/dashboard")) return "Employee Dashboard";
    if (path.includes("/employee/apply-leave")) return "Apply Leave";
    if (path.includes("/employee/history")) return "Leave History";
    if (path.includes("/employee/balance")) return "Leave Balance";
    if (path.includes("/employee/profile")) return "My Profile";
    
    if (path.includes("/manager/dashboard")) return "Manager Dashboard";
    if (path.includes("/manager/requests")) return "Pending Approvals";
    if (path.includes("/manager/calendar")) return "Team Calendar";
    if (path.includes("/manager/members")) return "Team Members";
    if (path.includes("/manager/profile")) return "Manager Profile";

    if (path.includes("/admin/dashboard")) return "HR Admin Dashboard";
    if (path.includes("/admin/employees")) return "Employee Directory";
    if (path.includes("/admin/departments")) return "Departments Management";
    if (path.includes("/admin/leave-types")) return "Leave Policy Settings";
    if (path.includes("/admin/holidays")) return "Holiday Calendar";
    if (path.includes("/admin/reports")) return "System Reports";
    if (path.includes("/admin/settings")) return "System Configuration";

    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-background flex font-sans antialiased text-foreground">
      {/* Desktop Sidebar (Fixed Left, 256px wide or collapsed 80px) */}
      <Sidebar
        items={sidebarItems}
        role={role}
        onLogout={onLogout}
        user={user}
      />

      {/* Mobile Slide-in Drawer Sidebar */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        items={sidebarItems}
        role={role}
        onLogout={onLogout}
        user={user}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen transition-all duration-300">
        {/* Sticky Header Topbar */}
        <Topbar
          title={getPageTitle()}
          user={user}
          notifications={notifications}
          onToggleSidebar={() => setMobileSidebarOpen(true)}
          onLogout={onLogout}
        />

        {/* Nested routing child content viewport */}
        <main className="flex-1 flex flex-col justify-between">
          <PageContainer>
            <Outlet />
          </PageContainer>

          {/* Shared Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
