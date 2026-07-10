import { useState } from "react";
import { Users, FileClock, UserCheck, CalendarDays, Check, X } from "lucide-react";

export default function ManagerDashboard() {
  const [requests, setRequests] = useState([
    {
      id: "LV-102",
      name: "John Doe",
      avatar: "JD",
      role: "Software Engineer",
      type: "Annual Leave",
      start: "2026-07-15",
      end: "2026-07-20",
      days: 5,
      reason: "Family vacation to national park.",
    },
    {
      id: "LV-105",
      name: "Alice Smith",
      avatar: "AS",
      role: "UI/UX Designer",
      type: "Sick Leave",
      start: "2026-07-12",
      end: "2026-07-13",
      days: 1,
      reason: "Dental operation recovery.",
    },
    {
      id: "LV-106",
      name: "Bob Johnson",
      avatar: "BJ",
      role: "QA Engineer",
      type: "Casual Leave",
      start: "2026-07-18",
      end: "2026-07-19",
      days: 1,
      reason: "Personal urgent business.",
    },
  ]);

  const stats = [
    { label: "Pending Approvals", value: requests.length, icon: FileClock, color: "bg-indigo-50 text-indigo-600" },
    { label: "Active Team Members", value: 8, icon: Users, color: "bg-emerald-50 text-emerald-600" },
    { label: "Currently On Leave", value: 2, icon: CalendarDays, color: "bg-rose-50 text-rose-600" },
  ];

  const handleAction = (id, action) => {
    // Mock action handler
    alert(`Request ${id} has been ${action}d!`);
    setRequests(requests.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manager Dashboard</h1>
        <p className="text-slate-500 text-sm">Review leave requests, team attendance, and schedules.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-extrabold text-slate-800">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Pending Approvals</h3>

        {requests.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-600">All caught up!</p>
            <p className="text-xs text-slate-400">There are no pending leave requests to review.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Employee</th>
                  <th className="pb-3">Leave Details</th>
                  <th className="pb-3">Days</th>
                  <th className="pb-3">Reason</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {req.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 leading-none">{req.name}</p>
                          <span className="text-[10px] text-slate-400 font-medium">{req.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="font-medium text-slate-800 text-xs">{req.type}</p>
                      <span className="text-slate-400 text-xs">
                        {req.start} to {req.end}
                      </span>
                    </td>
                    <td className="py-4 font-semibold text-slate-800">{req.days} days</td>
                    <td className="py-4 max-w-xs truncate text-xs text-slate-500" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleAction(req.id, "Approve")}
                          className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-100 cursor-pointer"
                          title="Approve Request"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAction(req.id, "Reject")}
                          className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors border border-rose-100 cursor-pointer"
                          title="Reject Request"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
