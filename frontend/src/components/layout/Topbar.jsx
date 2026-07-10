import PropTypes from "prop-types";
import { Menu, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Topbar({
  onMenuClick,
  title = "",
  userName = "User",
  userRole = "Employee",
  userInitial = "U",
  role = "",
}) {
  const getBadgeColor = () => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-teal-500";
      case "manager":
        return "bg-indigo-500";
      default:
        return "bg-emerald-500";
    }
  };

  const getAvatarBg = () => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "manager":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile Toggle Menu */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
        {title && (
          <h2 className="text-lg font-semibold text-slate-800 hidden sm:block">
            {title}
          </h2>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors relative cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${getBadgeColor()}`}></span>
        </button>

        <div className="h-8 w-px bg-slate-200"></div>

        {/* User Info Block */}
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className={`font-bold text-sm ${getAvatarBg()}`}>
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-none">{userName}</p>
            <span className="text-[10px] text-slate-400 font-medium">{userRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

Topbar.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
  title: PropTypes.string,
  userName: PropTypes.string,
  userRole: PropTypes.string,
  userInitial: PropTypes.string,
  role: PropTypes.string,
};
