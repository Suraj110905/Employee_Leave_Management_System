import PropTypes from "prop-types";

export default function Logo({ role = "", collapsed = false }) {
  const getBadgeColor = () => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-teal-500/20 text-teal-400 border-teal-500/30";
      case "manager":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
      default:
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    }
  };

  const getIconColor = () => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-teal-500 text-slate-900";
      case "manager":
        return "bg-indigo-500 text-slate-900";
      default:
        return "bg-emerald-500 text-slate-900";
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 ${getIconColor()}`}>
        {role ? role.charAt(0).toUpperCase() : "L"}
      </div>
      {!collapsed && (
        <div className="flex flex-col select-none">
          <span className="font-bold text-lg leading-none text-white tracking-tight">
            LeavePortal
          </span>
          {role && (
            <span className={`text-[9px] font-bold tracking-wider uppercase border rounded px-1 mt-1 text-center ${getBadgeColor()}`}>
              {role}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

Logo.propTypes = {
  role: PropTypes.string,
  collapsed: PropTypes.bool,
};
