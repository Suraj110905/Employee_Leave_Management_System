import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings2,
  Palmtree,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Add actual logout logic (clear tokens, context)
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Employees",
      path: "/admin/employees",
      icon: Users,
    },
    {
      name: "Departments",
      path: "/admin/departments",
      icon: Building2,
    },
    {
      name: "Leave Types",
      path: "/admin/leave-types",
      icon: Settings2,
    },
    {
      name: "Holidays",
      path: "/admin/holidays",
      icon: Palmtree,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: BarChart3,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-slate-900 text-slate-100 border-r border-slate-800 z-30">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-900 font-bold">
            A
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none text-white">LeavePortal</h1>
            <span className="text-[10px] text-teal-400 font-semibold tracking-wider uppercase">HR Admin</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-teal-600 text-white shadow-lg shadow-teal-900/30"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-100 border-r border-slate-800 z-50 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-900 font-bold">
              A
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none text-white">LeavePortal</h1>
              <span className="text-[10px] text-teal-400 font-semibold tracking-wider uppercase">HR Admin</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto" onClick={() => setSidebarOpen(false)}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-teal-600 text-white shadow-lg shadow-teal-900/30"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => {
              setSidebarOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 hidden sm:block">
              HR Administration
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors relative cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500"></span>
            </button>

            <div className="h-8 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-sm">
                AD
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-none">Admin User</p>
                <span className="text-[10px] text-slate-400 font-medium">HR Specialist</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
