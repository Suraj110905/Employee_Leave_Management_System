import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ChevronRight, UserCheck } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // Default mock role
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication delay
    setTimeout(() => {
      setIsLoading(false);
      // Redirect based on selected role
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "manager") {
        navigate("/manager/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    }, 1000);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100/50 p-8 font-sans transition-all duration-300">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-600 text-white font-bold text-xl mb-4 shadow-lg shadow-emerald-100">
          L
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Welcome to LeavePortal</h2>
        <p className="text-slate-500 text-sm mt-1">Sign in to manage your leave requests</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Select Your Test Role
          </label>
          <div className="relative">
            <UserCheck className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-700 bg-white text-sm appearance-none transition-all cursor-pointer font-medium"
            >
              <option value="employee">Employee Demo (John Doe)</option>
              <option value="manager">Manager Demo (Sarah Hansen)</option>
              <option value="admin">HR Admin Demo (Admin User)</option>
            </select>
            <div className="absolute right-4 top-4 pointer-events-none w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-500"></div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
            <input
              type="email"
              required
              placeholder="e.g. demo@leaveportal.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-700 text-sm transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Password
            </label>
            <a href="#" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
              Forgot?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-700 text-sm transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg shadow-emerald-100 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              Sign In
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
        Demo Credentials: Any email and password will work. Just pick the desired role.
      </div>
    </div>
  );
}
