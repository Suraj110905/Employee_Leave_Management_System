import { Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function EmployeeDashboard() {
  // Mock leave balance data
  const leaveBalances = [
    { type: "Annual / Paid Leave", total: 15, used: 3, available: 12, color: "emerald" },
    { type: "Sick Leave", total: 10, used: 2, available: 8, color: "rose" },
    { type: "Casual Leave", total: 8, used: 4, available: 4, color: "amber" },
    { type: "Maternity/Paternity", total: 30, used: 0, available: 30, color: "sky" },
  ];

  // Mock recent leaves
  const recentLeaves = [
    {
      id: "LV-102",
      type: "Annual Leave",
      start: "2026-07-15",
      end: "2026-07-20",
      days: 5,
      status: "Pending",
      manager: "Sarah Hansen",
    },
    {
      id: "LV-098",
      type: "Sick Leave",
      start: "2026-06-10",
      end: "2026-06-11",
      days: 1,
      status: "Approved",
      manager: "Sarah Hansen",
    },
    {
      id: "LV-085",
      type: "Casual Leave",
      start: "2026-05-02",
      end: "2026-05-03",
      days: 2,
      status: "Rejected",
      manager: "Sarah Hansen",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Dashboard</h1>
        <p className="text-slate-500 text-sm">View leave balances, recent history, and apply for leaves.</p>
      </div>

      {/* Grid of Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {leaveBalances.map((bal, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div
              className={`absolute top-0 left-0 w-2 h-full bg-${
                bal.color === "emerald"
                  ? "emerald-500"
                  : bal.color === "rose"
                  ? "rose-500"
                  : bal.color === "amber"
                  ? "amber-500"
                  : "sky-500"
              }`}
            ></div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              {bal.type}
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-800">{bal.available}</span>
              <span className="text-xs text-slate-400 font-medium">days available</span>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <span>Total: {bal.total}d</span>
              <span>Used: {bal.used}d</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent requests list */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Recent Leave Requests</h3>
            <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Leave ID</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Days</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-semibold text-slate-800">{leave.id}</td>
                    <td className="py-3">{leave.type}</td>
                    <td className="py-3 text-xs">
                      {leave.start} to {leave.end}
                    </td>
                    <td className="py-3 font-medium text-slate-800">{leave.days} days</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(
                          leave.status
                        )}`}
                      >
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick action + stats cards */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-100 flex flex-col justify-between h-48 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
              <Calendar className="w-48 h-48" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Need time off?</h3>
              <p className="text-emerald-100 text-xs">Submit a leave request for approval by your manager.</p>
            </div>
            <button className="w-full py-3 bg-white text-emerald-800 font-semibold rounded-xl text-center shadow-md hover:bg-emerald-50 transition-all cursor-pointer">
              Apply for Leave
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-md font-bold text-slate-800">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl flex flex-col items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500 mb-1" />
                <span className="text-xl font-bold text-slate-800">1</span>
                <span className="text-[10px] font-medium text-slate-400 uppercase">Pending</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl flex flex-col items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-1" />
                <span className="text-xl font-bold text-slate-800">5</span>
                <span className="text-[10px] font-medium text-slate-400 uppercase">Approved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
