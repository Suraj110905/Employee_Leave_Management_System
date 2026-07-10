import { Users, Building2, CalendarRange, ClipboardCheck, ArrowUpRight } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Employees", value: 45, icon: Users, change: "+3 this month", color: "text-teal-600 bg-teal-50" },
    { label: "Departments", value: 5, icon: Building2, change: "All active", color: "text-blue-600 bg-blue-50" },
    { label: "Current Month Leaves", value: 14, icon: CalendarRange, change: "Avg 2.1 days", color: "text-emerald-600 bg-emerald-50" },
    { label: "Pending HR Approvals", value: 4, icon: ClipboardCheck, change: "Action required", color: "text-amber-600 bg-amber-50" },
  ];

  const recentActivities = [
    { text: "John Doe submitted a Leave Request", time: "10 mins ago", type: "request" },
    { text: "New department 'Marketing' was created", time: "2 hours ago", type: "config" },
    { text: "Sick Leave policy updated from 8 to 10 days", time: "1 day ago", type: "policy" },
    { text: "Sarah Hansen approved Alice Smith's request", time: "1 day ago", type: "approval" },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">HR Administration Dashboard</h1>
        <p className="text-slate-500 text-sm">Configure system parameters, manage staff, and analyze reports.</p>
      </div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </span>
                <span className={`p-2 rounded-lg ${stat.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </span>
              </div>
              <div className="mt-2">
                <span className="text-3xl font-extrabold text-slate-800 leading-none">
                  {stat.value}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{stat.change}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Department Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-100 rounded-xl hover:border-teal-200 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-800 text-sm">Engineering</span>
                <span className="text-xs text-slate-400">18 employees</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full w-[80%] rounded-full"></div>
              </div>
            </div>
            <div className="p-4 border border-slate-100 rounded-xl hover:border-teal-200 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-800 text-sm">Product & UI</span>
                <span className="text-xs text-slate-400">7 employees</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full w-[45%] rounded-full"></div>
              </div>
            </div>
            <div className="p-4 border border-slate-100 rounded-xl hover:border-teal-200 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-800 text-sm">Human Resources</span>
                <span className="text-xs text-slate-400">4 employees</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full w-[25%] rounded-full"></div>
              </div>
            </div>
            <div className="p-4 border border-slate-100 rounded-xl hover:border-teal-200 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-800 text-sm">Operations</span>
                <span className="text-xs text-slate-400">16 employees</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full w-[60%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-800">System Activity Log</h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivities.map((act, idx) => (
                <li key={idx}>
                  <div className="relative pb-6">
                    {idx !== recentActivities.length - 1 ? (
                      <span className="absolute top-4 left-2 -ml-px h-full w-0.5 bg-slate-100" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-4 w-4 rounded-full bg-teal-500 flex items-center justify-center ring-4 ring-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-600">{act.text}</p>
                        <span className="text-[10px] text-slate-400">{act.time}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
